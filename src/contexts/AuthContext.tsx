import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

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
  /** Current authenticated user, or null if not logged in. */
  user: AuthUser | null;
  /** Current step in the registration / login flow. */
  step: AuthStep;
  /** Phone number entered by the user. */
  phone: string;
  /** Whether an async operation is in progress. */
  loading: boolean;
  /** Last error message, if any. */
  error: string | null;

  /** Step 1: Submit phone number. Simulates sending an SMS code. */
  submitPhone: (phone: string) => Promise<void>;
  /** Step 2: Verify the SMS code. */
  verifyCode: (code: string) => Promise<boolean>;
  /** Step 3: Set the user's display name and complete registration. */
  setProfileName: (name: string) => void;
  /** Log out and clear stored session. */
  logout: () => void;
  /** Resend the SMS code (simulated). */
  resendCode: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'telleg_auth_user';

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AuthUser;
  } catch {
    // corrupted data — ignore
  }
  return null;
}

function saveUser(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadUser());
  const [step, setStep] = useState<AuthStep>(() => (loadUser() ? 'done' : 'phone'));
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep localStorage in sync.
  useEffect(() => {
    if (user) saveUser(user);
  }, [user]);

  const submitPhone = async (phoneNumber: string) => {
    setError(null);
    setLoading(true);

    // Basic validation: digits only, 10-15 chars after stripping non-digits.
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      setError('Введите корректный номер телефона');
      setLoading(false);
      return;
    }

    // Simulate network delay for sending SMS.
    await new Promise((r) => setTimeout(r, SMS_SEND_DELAY));

    setPhone(phoneNumber);
    setStep('code');
    setLoading(false);
  };

  const verifyCode = async (code: string): Promise<boolean> => {
    setError(null);
    setLoading(true);

    // Simulate verification delay.
    await new Promise((r) => setTimeout(r, 600));

    if (code !== MOCK_SMS_CODE) {
      setError('Неверный код. Попробуйте ещё раз');
      setLoading(false);
      return false;
    }

    // Check if user already exists (returning user).
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
    const newUser: AuthUser = {
      id: 'me',
      name: name.trim(),
      phone,
      online: true,
    };
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
  };

  const resendCode = async () => {
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, SMS_SEND_DELAY));
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, step, phone, loading, error, submitPhone, verifyCode, setProfileName, logout, resendCode }}
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
