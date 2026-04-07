/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BuilderMode } from "./components/BuilderMode";
import { ExecutiveMode } from "./components/ExecutiveMode";
import { MainframeQuery } from "./components/MainframeQuery";
import { SixHats } from "./components/SixHats";
import { SystemPorts } from "./components/SystemPorts";
import { BoomerangPanel } from "./components/BoomerangPanel";
import { BurnTransition } from "./components/BurnTransition";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { auth, db, signInWithGoogle, logout, handleFirestoreError, OperationType } from "./lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, setDoc, doc, getDoc } from "firebase/firestore";
import { queryMainframe } from "./lib/gemini";
import { cn } from "./lib/utils";
import { Layers, Briefcase, Terminal, ShieldAlert } from "lucide-react";

type Mode = 'builder' | 'executive';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [mode, setMode] = useState<Mode>('builder');
  const [isChangingMode, setIsChangingMode] = useState(false);
  const [activeHat, setActiveHat] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [shake, setShake] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Ensure user document exists
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            role: 'user',
            createdAt: serverTimestamp()
          });
        }
      }
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Message Listener
  useEffect(() => {
    if (!user || !isAuthReady) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, 'messages'),
      where('uid', '==', user.uid),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        role: doc.data().role as 'user' | 'ai',
        content: doc.data().content
      }));
      setMessages(msgs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'messages');
    });

    return () => unsubscribe();
  }, [user, isAuthReady]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuery = async (queryText: string) => {
    if (!user) {
      signInWithGoogle();
      return;
    }

    // Persist user message
    try {
      await addDoc(collection(db, 'messages'), {
        uid: user.uid,
        role: 'user',
        content: queryText,
        mode,
        hat: activeHat || 'none',
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'messages');
    }

    setIsTyping(true);
    
    // Trigger "Field Excitation" (screen shake)
    if (mode === 'builder') {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      if (window.navigator.vibrate) {
        window.navigator.vibrate([50, 30, 50]);
      }
    }

    const response = await queryMainframe(queryText, mode, activeHat || undefined);
    
    // Persist AI response
    try {
      await addDoc(collection(db, 'messages'), {
        uid: user.uid,
        role: 'ai',
        content: response || "...",
        mode,
        hat: activeHat || 'none',
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'messages');
    }

    setIsTyping(false);
  };

  const toggleMode = (newMode: Mode) => {
    if (newMode === mode) return;
    setIsChangingMode(true);
    setTimeout(() => {
      setMode(newMode);
      setMessages([]); // Clear context on mode switch for fresh persona
    }, 400); // Halfway through the burn duration
    setTimeout(() => {
      setIsChangingMode(false);
    }, 800); // Full burn duration
  };

  return (
    <ErrorBoundary>
      <motion.div 
        animate={shake ? { x: [-5, 5, -5, 5, 0], y: [-5, 5, -5, 5, 0] } : {}}
        className="relative"
      >
        <BurnTransition isChanging={isChangingMode} />

        {/* Auth / Mode Toggle */}
        <div className="fixed top-8 right-8 z-50 flex items-center gap-4">
          {!user && isAuthReady && (
            <button
              onClick={signInWithGoogle}
              className="px-4 py-2 glass border-white/10 rounded-full text-[10px] font-mono uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Initialize Identity
            </button>
          )}
          
          {user && (
            <div className="flex gap-2 p-1 glass rounded-full border-white/10">
              <button
                onClick={() => toggleMode('builder')}
                className={cn(
                  "p-2 rounded-full transition-all",
                  mode === 'builder' ? "bg-slime text-black" : "text-white/40 hover:text-white"
                )}
                title="Builder Mode"
              >
                <Terminal className="w-5 h-5" />
              </button>
              <button
                onClick={() => toggleMode('executive')}
                className={cn(
                  "p-2 rounded-full transition-all",
                  mode === 'executive' ? "bg-executive-gold text-executive-navy" : "text-white/40 hover:text-white"
                )}
                title="Executive Mode"
              >
                <Briefcase className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

      <AnimatePresence mode="wait">
        {mode === 'builder' ? (
          <motion.div
            key="builder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BuilderMode>
              <div className="grid lg:grid-cols-12 gap-8 h-full">
                <div className="lg:col-span-8 flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-hide" ref={scrollRef}>
                    {messages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                        <Layers className="w-16 h-16 text-slime" />
                        <p className="font-mono text-sm tracking-widest">SYSTEM IDLE // AWAITING EXCITATION</p>
                      </div>
                    )}
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "flex flex-col",
                          msg.role === 'user' ? "items-end" : "items-start"
                        )}
                      >
                        <div className={cn(
                          "max-w-[80%] p-4 rounded-2xl font-mono text-sm",
                          msg.role === 'user' 
                            ? "bg-white/5 border border-white/10 text-white" 
                            : "bg-slime/10 border border-slime/20 text-slime"
                        )}>
                          <div className="text-[10px] opacity-40 mb-1 uppercase tracking-widest">
                            {msg.role === 'user' ? 'Meatsuit' : 'Sovereign.OS'}
                          </div>
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <div className="flex items-center gap-2 text-slime/50 font-mono text-xs">
                        <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity }} className="w-2 h-2 bg-slime rounded-full" />
                        PROCESSING FIELD DATA...
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:col-span-4 space-y-8">
                  <SixHats activeHat={activeHat} onSelect={setActiveHat} mode={mode} />
                  <SystemPorts mode={mode} />
                </div>
              </div>
            </BuilderMode>
          </motion.div>
        ) : (
          <motion.div
            key="executive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ExecutiveMode 
              activeHat={activeHat} 
              onSelectHat={setActiveHat} 
              mode={mode}
            >
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-8 pr-4 scrollbar-hide" ref={scrollRef}>
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-10 text-center space-y-6">
                      <ShieldAlert className="w-20 h-20 text-executive-gold" />
                      <p className="font-mono text-xs tracking-[0.5em] uppercase">Boardroom Protocol Initialized</p>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <div className={cn(
                        "text-[10px] font-mono tracking-widest uppercase",
                        msg.role === 'user' ? "text-executive-silver/40" : "text-executive-gold"
                      )}>
                        {msg.role === 'user' ? 'Inquiry' : 'Sovereign Directive'}
                      </div>
                      <div className={cn(
                        "text-lg leading-relaxed",
                        msg.role === 'user' ? "text-executive-silver font-light" : "text-white font-medium"
                      )}>
                        {msg.content}
                      </div>
                      {msg.role === 'ai' && (
                        <div className="h-[1px] w-full bg-gradient-to-r from-executive-gold/20 via-transparent to-transparent mt-4" />
                      )}
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="text-executive-gold/40 font-mono text-[10px] tracking-widest animate-pulse">
                      COUNCIL DELIBERATING...
                    </div>
                  )}
                </div>
              </div>
            </ExecutiveMode>
          </motion.div>
        )}
      </AnimatePresence>

      <MainframeQuery mode={mode} onQuery={handleQuery} />
      <BoomerangPanel mode={mode} />
    </motion.div>
    </ErrorBoundary>
  );
}

