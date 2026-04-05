import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type PrivacySettings, DEFAULT_PRIVACY } from '@/components/settings/PrivacySettings';
import { type AppearanceConfig, DEFAULT_APPEARANCE, getThemeCSSVars, applyAppearanceToDOM } from '@/components/settings/AppearanceSettings';
import { type SystemSettings, DEFAULT_SYSTEM_SETTINGS, applySystemSettings } from '@/components/admin/AdminPanel';

/** Simulated SMS verification code. In production, this would come from a backend. */
const MOCK_SMS_CODE = '1234';

/** Delay in ms before the simulated SMS "arrives". */
const SMS_SEND_DELAY = 800;

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  online: boolean;
}

type AuthStep = 'phone' | 'code' | 'profile' | 'done';

interface AuthContextValue {
  user: AuthUser | null;
  step: AuthStep;
  phone: string;
  loading: boolean;
  error: string | null;
  privacy: PrivacySettings;
  appearance: AppearanceConfig;
  systemSettings: SystemSettings;

  submitPhone: (phone: string) => Promise<void>;
  verifyCode: (code: string) => Promise<boolean>;
  setProfileName: (name: string) => void;
  logout: () => void;
  resendCode: () => Promise<void>;
  goBack: () => void;
  updatePrivacy: (privacy: PrivacySettings) => void;
  updateAppearance: (appearance: AppearanceConfig) => void;
  updateSystemSettings: (settings: SystemSettings) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'telleg_auth_user';
const PRIVACY_STORAGE_KEY = 'telleg_privacy';
const APPEARANCE_STORAGE_KEY = 'telleg_appearance';
const SYSTEM_SETTINGS_KEY = 'telleg_system_settings';

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AuthUser;
  } catch { /* ignore */ }
  return null;
}

function saveUser(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem(STORAGE_KEY);
}

function loadPrivacy(): PrivacySettings {
  try {
    const raw = localStorage.getItem(PRIVACY_STORAGE_KEY);
    if (raw) return { ...DEFAULT_PRIVACY, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_PRIVACY;
}

function savePrivacy(privacy: PrivacySettings) {
  localStorage.setItem(PRIVACY_STORAGE_KEY, JSON.stringify(privacy));
}

function loadAppearance(): AppearanceConfig {
  try {
    const raw = localStorage.getItem(APPEARANCE_STORAGE_KEY);
    if (raw) return { ...DEFAULT_APPEARANCE, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_APPEARANCE;
}

function saveAppearance(config: AppearanceConfig) {
  localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(config));
}

function loadSystemSettings(): SystemSettings {
  try {
    const raw = localStorage.getItem(SYSTEM_SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SYSTEM_SETTINGS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_SYSTEM_SETTINGS;
}

function saveSystemSettings(s: SystemSettings) {
  localStorage.setItem(SYSTEM_SETTINGS_KEY, JSON.stringify(s));
}

/** Apply CSS custom properties to :root so the theme takes effect globally. */
function applyThemeToDOM(config: AppearanceConfig) {
  const vars = getThemeCSSVars(config);
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
  applyAppearanceToDOM(config);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadUser());
  const [step, setStep] = useState<AuthStep>(() => (loadUser() ? 'done' : 'phone'));
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<PrivacySettings>(() => loadPrivacy());
  const [appearance, setAppearance] = useState<AppearanceConfig>(() => loadAppearance());
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => loadSystemSettings());

  // Keep localStorage in sync.
  useEffect(() => { if (user) saveUser(user); }, [user]);
  useEffect(() => { savePrivacy(privacy); }, [privacy]);
  useEffect(() => { saveAppearance(appearance); applyThemeToDOM(appearance); }, [appearance]);
  useEffect(() => { saveSystemSettings(systemSettings); applySystemSettings(systemSettings); }, [systemSettings]);

  // Apply theme on initial load.
  useEffect(() => { applyThemeToDOM(appearance); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { applySystemSettings(systemSettings); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submitPhone = async (phoneNumber: string) => {
    setError(null);
    setLoading(true);
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      setError('Введите корректный номер телефона');
      setLoading(false);
      return;
    }
    await new Promise((r) => setTimeout(r, SMS_SEND_DELAY));
    setPhone(phoneNumber);
    setStep('code');
    setLoading(false);
  };

  const verifyCode = async (code: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (code !== MOCK_SMS_CODE) {
      setError('Неверный код. Попробуйте ещё раз');
      setLoading(false);
      return false;
    }
    const existing = loadUser();
    if (existing && existing.phone === phone) {
      setUser(existing);
      setStep('done');
      setLoading(false);
      return true;
    }
    setStep('profile');
    setLoading(false);
    return true;
  };

  const setProfileName = (name: string) => {
    const newUser: AuthUser = { id: 'me', name: name.trim(), phone, online: true };
    setUser(newUser);
    saveUser(newUser);
    setStep('done');
  };

  const logout = () => {
    setUser(null);
    setPhone('');
    setStep('phone');
    setError(null);
    clearUser();
    localStorage.removeItem(PRIVACY_STORAGE_KEY);
    localStorage.removeItem(APPEARANCE_STORAGE_KEY);
    localStorage.removeItem(SYSTEM_SETTINGS_KEY);
    setPrivacy(DEFAULT_PRIVACY);
    setAppearance(DEFAULT_APPEARANCE);
    setSystemSettings(DEFAULT_SYSTEM_SETTINGS);
    applyThemeToDOM(DEFAULT_APPEARANCE);
    applySystemSettings(DEFAULT_SYSTEM_SETTINGS);
  };

  const resendCode = async () => {
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, SMS_SEND_DELAY));
    setLoading(false);
  };

  const goBack = () => {
    setError(null);
    if (step === 'code') { setStep('phone'); setPhone(''); }
    else if (step === 'profile') { setStep('code'); }
  };

  const updatePrivacy = (p: PrivacySettings) => setPrivacy(p);
  const updateAppearance = (a: AppearanceConfig) => setAppearance(a);
  const updateSystemSettings = (s: SystemSettings) => setSystemSettings(s);

  return (
    <AuthContext.Provider
      value={{ user, step, phone, loading, error, privacy, appearance, systemSettings, submitPhone, verifyCode, setProfileName, logout, resendCode, goBack, updatePrivacy, updateAppearance, updateSystemSettings }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
