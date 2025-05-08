import { 
  signInWithEmailAndPassword as firebaseSignIn,
  getAuth
} from 'firebase/auth';

export const signInWithEmailAndPassword = async (
  email: string, 
  password: string
) => {
  try {
    const auth = getAuth();
    // Disable app verification for testing
    (auth as any).settings = { appVerificationDisabledForTesting: true };
    
    // Perform direct sign in
    const result = await firebaseSignIn(auth, email, password);
    return result;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};
