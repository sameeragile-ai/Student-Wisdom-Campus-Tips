import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Tip, Report, ReportReason, Toast, CategorySlug } from '../types';
import { INITIAL_USERS } from '../data/users';
import { INITIAL_TIPS } from '../data/tips';
import { INITIAL_REPORTS } from '../data/reports';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  tips: Tip[];
  reports: Report[];
  blockedUserIds: string[];
  userVotes: string[]; // Tip IDs upvoted by currentUser
  toasts: Toast[];
  
  // Auth methods
  login: (email: string, pass: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, pass: string, studyProgram: string) => { success: boolean; error?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  
  // Tip actions
  toggleUpvote: (tipId: string) => boolean;
  createTip: (data: Omit<Tip, 'id' | 'authorId' | 'authorName' | 'authorAvatar' | 'authorProgram' | 'createdAt' | 'updatedAt' | 'upvotes'>) => string;
  updateTip: (tipId: string, updates: Partial<Omit<Tip, 'id' | 'authorId' | 'createdAt'>>) => void;
  deleteTip: (tipId: string) => void;
  
  // Moderation / Reports
  reportTip: (tipId: string, reason: ReportReason, comment?: string) => void;
  dismissReport: (reportId: string) => void;
  toggleBlockUser: (userId: string) => void;
  updateProfile: (userId: string, data: { name: string; studyProgram: string; bio?: string }) => void;
  
  // Admin & System
  resetDemoData: () => void;
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  
  // Helper queries
  getTipById: (id: string) => Tip | undefined;
  getUserById: (id: string) => User | undefined;
  hasOpenReport: (tipId: string) => boolean;
  getTipsByCategory: (category: CategorySlug) => Tip[];
}

const STORAGE_KEYS = {
  USERS: 'tipjar_users_v1',
  TIPS: 'tipjar_tips_v1',
  REPORTS: 'tipjar_reports_v1',
  CURRENT_USER_ID: 'tipjar_current_user_v1',
  VOTES_MAP: 'tipjar_user_votes_v1',
  BLOCKED_IDS: 'tipjar_blocked_users_v1',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // 1. Initialize Users
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // 2. Initialize Blocked User IDs
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOCKED_IDS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 3. Initialize Current User (Default to Maya Chen for immediate client testing)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      if (savedId) {
        const found = users.find((u) => u.id === savedId);
        if (found && !blockedUserIds.includes(found.id)) return found;
      }
      return users.find((u) => u.id === 'user-maya') || users[0] || null;
    } catch {
      return INITIAL_USERS[0];
    }
  });

  // 4. Initialize Tips
  const [tips, setTips] = useState<Tip[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIPS);
      return saved ? JSON.parse(saved) : INITIAL_TIPS;
    } catch {
      return INITIAL_TIPS;
    }
  });

  // 5. Initialize Reports
  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return saved ? JSON.parse(saved) : INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  });

  // 6. User Votes Map { [userId]: [tipId1, tipId2] }
  const [votesMap, setVotesMap] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VOTES_MAP);
      if (saved) return JSON.parse(saved);
      // Seed initial votes for Maya Chen so profile "Upvoted" tab has realistic content
      return {
        'user-maya': ['tip-h1', 'tip-c1', 'tip-d1', 'tip-c2', 'tip-d7'],
      };
    } catch {
      return {
        'user-maya': ['tip-h1', 'tip-c1', 'tip-d1', 'tip-c2', 'tip-d7'],
      };
    }
  });

  // 7. Toasts State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIPS, JSON.stringify(tips));
  }, [tips]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BLOCKED_IDS, JSON.stringify(blockedUserIds));
  }, [blockedUserIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VOTES_MAP, JSON.stringify(votesMap));
  }, [votesMap]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUser.id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  }, [currentUser]);

  // Toast Helpers
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth: Email restriction helper
  const isUniversityEmail = (email: string) => {
    return email.trim().toLowerCase().endsWith('@student.uni.edu');
  };

  const login = (email: string, _pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!isUniversityEmail(cleanEmail)) {
      return { success: false, error: 'Only university emails (@student.uni.edu) can log in.' };
    }

    const matchedUser = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!matchedUser) {
      return { success: false, error: 'No account found with this university email. Try a quick demo login.' };
    }

    if (blockedUserIds.includes(matchedUser.id)) {
      return { success: false, error: 'This student account has been suspended by campus moderators.' };
    }

    setCurrentUser(matchedUser);
    showToast(`Welcome back, ${matchedUser.name}!`, 'success');
    return { success: true };
  };

  const signup = (name: string, email: string, _pass: string, studyProgram: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!name.trim()) {
      return { success: false, error: 'Please enter your student name.' };
    }
    if (!isUniversityEmail(cleanEmail)) {
      return { success: false, error: 'University domain restriction: email must end with @student.uni.edu' };
    }

    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this university email already exists.' };
    }

    // Pick random pravatar id 1-70
    const randomAvatarNum = Math.floor(Math.random() * 65) + 1;
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      avatar: `https://i.pravatar.cc/150?img=${randomAvatarNum}`,
      studyProgram: studyProgram || 'Computer Science',
      role: 'student',
      isBlocked: false,
      joinedAt: new Date().toISOString(),
      bio: `Studying ${studyProgram || 'at University'}. Excited to share tips!`,
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    showToast(`Welcome to TipJar, ${newUser.name}!`, 'success');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Logged out securely.', 'info');
  };

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      if (blockedUserIds.includes(target.id)) {
        showToast('That account is blocked and cannot be switched to.', 'error');
        return;
      }
      setCurrentUser(target);
      showToast(`Switched active profile to ${target.name}`, 'info');
    }
  };

  // Upvoting logic (One vote per user per tip, toggles)
  const currentUserId = currentUser?.id || 'anonymous';
  const userVotes = votesMap[currentUserId] || [];

  const toggleUpvote = (tipId: string): boolean => {
    if (!currentUser) {
      showToast('Please log in to upvote tips.', 'warning');
      return false;
    }

    const hasVoted = userVotes.includes(tipId);
    const newVotes = hasVoted
      ? userVotes.filter((id) => id !== tipId)
      : [...userVotes, tipId];

    setVotesMap((prev) => ({
      ...prev,
      [currentUserId]: newVotes,
    }));

    // Update tip's total upvote count
    setTips((prev) =>
      prev.map((tip) => {
        if (tip.id === tipId) {
          return {
            ...tip,
            upvotes: hasVoted ? Math.max(0, tip.upvotes - 1) : tip.upvotes + 1,
          };
        }
        return tip;
      })
    );

    if (!hasVoted) {
      showToast('Upvoted! Thanks for helping other students.', 'success');
    } else {
      showToast('Vote removed.', 'info');
    }

    return !hasVoted;
  };

  // Create a new tip
  const createTip = (
    data: Omit<Tip, 'id' | 'authorId' | 'authorName' | 'authorAvatar' | 'authorProgram' | 'createdAt' | 'updatedAt' | 'upvotes'>
  ): string => {
    if (!currentUser) {
      showToast('You must be logged in to share a tip.', 'error');
      return '';
    }

    const newTipId = `tip-${Date.now()}`;
    const now = new Date().toISOString();

    const newTip: Tip = {
      ...data,
      id: newTipId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorProgram: currentUser.studyProgram,
      createdAt: now,
      updatedAt: now,
      upvotes: 1, // Author's initial vote
      coverImage:
        data.coverImage && data.coverImage.trim()
          ? data.coverImage
          : `https://picsum.photos/seed/student-tip-${Date.now()}/800/500`,
    };

    setTips((prev) => [newTip, ...prev]);

    // Automatically count author's upvote
    setVotesMap((prev) => ({
      ...prev,
      [currentUser.id]: [...(prev[currentUser.id] || []), newTipId],
    }));

    showToast('Tip published! Thanks for contributing to campus wisdom.', 'success');
    return newTipId;
  };

  // Update a tip (sets updatedAt to current date)
  const updateTip = (
    tipId: string,
    updates: Partial<Omit<Tip, 'id' | 'authorId' | 'createdAt'>>
  ) => {
    const now = new Date().toISOString();
    setTips((prev) =>
      prev.map((tip) => {
        if (tip.id === tipId) {
          return {
            ...tip,
            ...updates,
            updatedAt: now,
          };
        }
        return tip;
      })
    );
    showToast('Tip updated successfully.', 'success');
  };

  // Delete a tip
  const deleteTip = (tipId: string) => {
    setTips((prev) => prev.filter((t) => t.id !== tipId));
    setReports((prev) => prev.filter((r) => r.tipId !== tipId));
    showToast('Tip deleted from campus directory.', 'info');
  };

  // Report a tip
  const reportTip = (tipId: string, reason: ReportReason, comment?: string) => {
    const tip = tips.find((t) => t.id === tipId);
    if (!tip) return;

    const newReport: Report = {
      id: `rep-${Date.now()}`,
      tipId,
      tipTitle: tip.title,
      tipCategory: tip.category,
      reporterId: currentUser?.id || 'guest',
      reporterName: currentUser?.name || 'Concerned Student',
      reason,
      comment: comment?.trim() || undefined,
      createdAt: new Date().toISOString(),
      status: 'open',
    };

    setReports((prev) => [newReport, ...prev]);
    showToast('Report submitted for admin moderation. Thank you for keeping info accurate!', 'info');
  };

  // Dismiss report
  const dismissReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'dismissed' } : r))
    );
    showToast('Report dismissed.', 'info');
  };

  // Block / Unblock user
  const toggleBlockUser = (userId: string) => {
    if (userId === 'user-admin') {
      showToast('Admin accounts cannot be suspended.', 'error');
      return;
    }

    const isCurrentlyBlocked = blockedUserIds.includes(userId);
    let newBlocked: string[];

    if (isCurrentlyBlocked) {
      newBlocked = blockedUserIds.filter((id) => id !== userId);
      showToast('Student account restored.', 'success');
    } else {
      newBlocked = [...blockedUserIds, userId];
      showToast('Student account blocked. User can no longer post or login.', 'warning');
      // If current active user was blocked, log them out
      if (currentUser?.id === userId) {
        setCurrentUser(null);
      }
    }

    setBlockedUserIds(newBlocked);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBlocked: !isCurrentlyBlocked } : u))
    );
  };

  // Edit user profile
  const updateProfile = (userId: string, data: { name: string; studyProgram: string; bio?: string }) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...data } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, ...data } : null));
    }
    // Also update authorName/authorProgram on their tips for consistency
    setTips((prev) =>
      prev.map((t) =>
        t.authorId === userId
          ? { ...t, authorName: data.name, authorProgram: data.studyProgram }
          : t
      )
    );
    showToast('Profile updated!', 'success');
  };

  // Reset demo data
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.TIPS);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.BLOCKED_IDS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.VOTES_MAP);

    setUsers(INITIAL_USERS);
    setTips(INITIAL_TIPS);
    setReports(INITIAL_REPORTS);
    setBlockedUserIds([]);
    setCurrentUser(INITIAL_USERS[0]); // Maya Chen
    setVotesMap({
      'user-maya': ['tip-h1', 'tip-c1', 'tip-d1', 'tip-c2', 'tip-d7'],
    });

    showToast('Demo data completely reset to initial clean state!', 'success');
  };

  // Helper query methods
  const getTipById = (id: string) => tips.find((t) => t.id === id);
  const getUserById = (id: string) => users.find((u) => u.id === id);
  const hasOpenReport = (tipId: string) =>
    reports.some((r) => r.tipId === tipId && r.status === 'open');
  const getTipsByCategory = (category: CategorySlug) =>
    tips.filter((t) => t.category === category);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        tips,
        reports,
        blockedUserIds,
        userVotes,
        toasts,
        login,
        signup,
        logout,
        switchUser,
        toggleUpvote,
        createTip,
        updateTip,
        deleteTip,
        reportTip,
        dismissReport,
        toggleBlockUser,
        updateProfile,
        resetDemoData,
        showToast,
        removeToast,
        getTipById,
        getUserById,
        hasOpenReport,
        getTipsByCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
