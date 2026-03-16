import React, { useState } from "react";
import { auth, db, googleProvider } from "../firebase";

import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

const StartScreen: React.FC = () => {

  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [error, setError] = useState("");

  // LOGIN GOOGLE
  const handleGoogleLogin = async () => {
    setError("");

    try {

      const result = await signInWithPopup(auth, googleProvider);

      const userRef = doc(db, "users", result.user.uid);

      await setDoc(userRef, {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
        createdAt: new Date().toISOString()
      }, { merge: true });

      window.location.reload();

    } catch (err) {
      console.error(err);
      setError("Erro ao entrar com Google.");
    }
  };

  // LOGIN / CADASTRO
  const handleAuthAction = async () => {

    setError("");

    if (!emailInput || !passwordInput) {
      setError("Preencha todos os campos.");
      return;
    }

    try {

      if (isLoginView) {

        await signInWithEmailAndPassword(
          auth,
          emailInput,
          passwordInput
        );

        window.location.reload();

      } else {

        if (!nameInput) {
          setError("Digite seu nome.");
          return;
        }

        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            emailInput,
            passwordInput
          );

        const newUser = userCredential.user;

        await setDoc(doc(db, "users", newUser.uid), {
          name: nameInput,
          email: newUser.email,
          photo: "",
          createdAt: new Date().toISOString()
        });

        window.location.reload();
      }

    } catch (err: any) {

      if (err.code === "auth/user-not-found") {
        setError("Usuário não encontrado.");
      }
      else if (err.code === "auth/wrong-password") {
        setError("Senha incorreta.");
      }
      else if (err.code === "auth/email-already-in-use") {
        setError("E-mail já cadastrado.");
      }
      else if (err.code === "auth/weak-password") {
        setError("Senha precisa ter 6 caracteres.");
      }
      else {
        setError("Erro ao autenticar.");
      }

    }

  };

  // RESET SENHA
  const handleResetPassword = async () => {

    if (!emailInput) {
      setError("Digite seu e-mail.");
      return;
    }

    try {

      await sendPasswordResetEmail(auth, emailInput);

      setError("Email de recuperação enviado.");

    } catch {
      setError("Erro ao enviar recuperação.");
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">

<div className="absolute top-6 left-6 flex items-center gap-3">
      <img
        src="/logovermelha.png"
        alt="Nibuy"
        className="h-20 shadow-[0_0_6px_rgba(0,0,0,0.25)"
      />
      <span className="text-[50px] font-black text-[#ff5722] shadow-[0_0_6px_rgba(0,0,0,0.25) ">
        𝙉𝙞𝙗𝙪𝙮
      </span>
    </div>

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">


        <h2 className="text-2xl font-black text-[#ff5722] text-center mb-6">
          {isLoginView ? "Login" : "Cadastro"}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-xm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">

          {!isLoginView && (
            <input
              type="text"
              placeholder="Nome"
              value={nameInput}
              onChange={(e)=>setNameInput(e.target.value)}
              className="w-full border p-3 rounded text-lg"
            />
          )}

          <input
            type="email"
            placeholder="E-mail"
            value={emailInput}
            onChange={(e)=>setEmailInput(e.target.value)}
            className="w-full border p-3 rounded text-lg"
          />

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={passwordInput}
              onChange={(e)=>setPasswordInput(e.target.value)}
              className="w-full border p-3 rounded pr-10 text-lg"
            />

            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-sm"
            >
              {showPassword ? "Ocultar" : "Ver"}
            </button>

          </div>

          {isLoginView && (
            <button
              onClick={handleResetPassword}
              className="text-sm text-gray-600 hover: color-[#ff5722]"
            >
              Esqueceu a senha?
            </button>
          )}

          <button
            onClick={handleAuthAction}
            className="w-full bg-[#ff5722] text-white py-3 rounded font-bold"
          >
            {isLoginView ? "Entrar" : "Cadastrar"}
          </button>

        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 flex items-center justify-center gap-3 border p-3 rounded-lg font-bold"
        >

          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-5 h-5"
          />

          Entrar com Google

        </button>

        <button
          onClick={()=>setIsLoginView(!isLoginView)}
          className="w-full mt-6 text-sm text-center font-bold"
        >
          {isLoginView
            ? "Criar conta"
            : "Já tenho conta"}
        </button>

      </div>

    </div>
  );
};

export default StartScreen;