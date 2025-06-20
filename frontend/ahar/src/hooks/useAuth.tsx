import { createContext, useContext, useEffect, useState } from 'react';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut,
    onAuthStateChanged,
    updateProfile,
} from 'firebase/auth';
import { 
    doc, 
    setDoc, 
    getDoc,
    onSnapshot,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AuthContextType, UserData, UserRole } from '../types/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '../components/ui/use-toast';

const AuthContext = createContext<AuthContextType | null>(null);

const handleFirebaseError = (error: any) => {
    console.error('Firebase error:', error);
    
    // Handle specific Firebase error codes
    switch (error.code) {
        case 'permission-denied':
            return "Access denied. Please make sure you're logged in.";
        case 'not-found':
            return "User profile not found. Please try signing up.";
        case 'already-exists':
            return "An account with this email already exists.";
        case 'invalid-email':
            return "Please enter a valid email address.";
        case 'weak-password':
            return "Password should be at least 6 characters.";
        case 'wrong-password':
            return "Incorrect password. Please try again.";
        case 'user-not-found':
            return "No account found with this email.";
        case 'network-request-failed':
            return "Network error. Please check your internet connection.";
        default:
            return error.message || "An unexpected error occurred. Please try again.";
    }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDocRef = doc(db, 'users', firebaseUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (!userDoc.exists()) {
                        // Create a basic profile if it doesn't exist
                        const basicProfile = {
                            email: firebaseUser.email!,
                            role: 'donor' as UserRole, // Default role
                            displayName: firebaseUser.displayName || '',
                            createdAt: new Date().toISOString()
                        };
                        await setDoc(userDocRef, basicProfile);
                        setUser({ uid: firebaseUser.uid, ...basicProfile });
                    } else {
                        setUser({ uid: firebaseUser.uid, ...userDoc.data() as Omit<UserData, 'uid'> });
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    toast({
                        title: "Error loading profile",
                        description: handleFirebaseError(error),
                        variant: "destructive"
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signUp = async (
        email: string, 
        password: string, 
        role: UserRole,
        userData: Partial<UserData>
    ) => {
        try {
            setLoading(true);
            const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
            
            const userProfile = {
                email,
                role,
                ...userData,
                createdAt: new Date().toISOString()
            };

            // Create user profile in Firestore
            await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);

            if (userData.displayName) {
                await updateProfile(firebaseUser, {
                    displayName: userData.displayName
                });
            }

            setUser({ uid: firebaseUser.uid, ...userProfile });

            toast({
                title: "Account created successfully!",
                description: "Welcome to our platform."
            });

            navigate(role === 'ngo' ? '/ngo-dashboard' : '/donor-dashboard');
        } catch (error) {
            toast({
                title: "Error creating account",
                description: handleFirebaseError(error),
                variant: "destructive"
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            setLoading(true);
            const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
            
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (!userDoc.exists()) {
                throw new Error('User profile not found');
            }

            const userData = userDoc.data() as UserData;
            setUser({ uid: firebaseUser.uid, ...userData });
            
            toast({
                title: "Welcome back!",
                description: "You've successfully signed in."
            });

            navigate(userData.role === 'ngo' ? '/ngo-dashboard' : '/donor-dashboard');
        } catch (error) {
            toast({
                title: "Error signing in",
                description: handleFirebaseError(error),
                variant: "destructive"
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signOut: async () => {
            try {
                await firebaseSignOut(auth);
                setUser(null);
                navigate('/');
                toast({
                    title: "Signed out successfully",
                    description: "Come back soon!"
                });
            } catch (error) {
                toast({
                    title: "Error signing out",
                    description: handleFirebaseError(error),
                    variant: "destructive"
                });
            }
        },
        updateUserProfile: async (data: Partial<UserData>) => {
            if (!auth.currentUser || !user) {
                toast({
                    title: "Error",
                    description: "You must be logged in to update your profile",
                    variant: "destructive"
                });
                return;
            }

            try {
                const userRef = doc(db, 'users', auth.currentUser.uid);
                await setDoc(userRef, data, { merge: true });

                if (data.displayName) {
                    await updateProfile(auth.currentUser, {
                        displayName: data.displayName
                    });
                }

                setUser({ ...user, ...data });

                toast({
                    title: "Profile updated",
                    description: "Your changes have been saved successfully."
                });
            } catch (error) {
                toast({
                    title: "Error updating profile",
                    description: handleFirebaseError(error),
                    variant: "destructive"
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
