import React, { useContext, useState, useEffect } from "react"

import { auth } from "../firebase/db";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";



const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  function login(auth, email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout(auth) {
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}