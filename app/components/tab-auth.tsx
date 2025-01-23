'use client';

import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toast from 'react-hot-toast';

interface LoginFormData {
  username: string;
  password: string;
}

interface RegisterFormData {
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export function TabsAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    reset: resetLoginForm,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>();

  const {
    register: registerForm,
    handleSubmit: handleRegisterSubmit,
    reset: resetRegisterForm,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormData>();

  const handleLogin: SubmitHandler<LoginFormData> = async (data) => {
    if (isEmpty(data)) {
      toast.error('Username dan password harus diisi.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        username: data.username,
        password: data.password,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Login Berhasil');
        resetLoginForm(); // Reset form
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister: SubmitHandler<RegisterFormData> = async (data) => {
    if (isEmpty(data)) {
      toast.error('Semua field harus diisi.');
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error('Password dan konfirmasi password tidak cocok.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          name: data.name,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData: any = await response.json();
        throw new Error(errorData.message || 'Gagal mendaftar.');
      }

      toast.success('Registrasi Berhasil');
      resetRegisterForm(); // Reset form
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Terjadi kesalahan.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isEmpty = (data: any) => {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== '') {
        return false;
      }
    }
    return true;
  };

  return (
    <Tabs defaultValue="login" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Daftar</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <form onSubmit={handleLoginSubmit(handleLogin)}>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Silakan masukkan username dan password Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Tony W"
                {...loginRegister('username', { required: 'Username wajib diisi' })}
              />
              {loginErrors.username && (
                <p className="text-red-500 text-sm">{loginErrors.username.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="***"
                {...loginRegister('password', { required: 'Password wajib diisi' })}
              />
              {loginErrors.password && (
                <p className="text-red-500 text-sm">{loginErrors.password.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <span className="spinner-border mr-2"></span>Memproses...
                </div>
              ) : (
                'Login'
              )}
            </Button>
          </CardFooter>
        </form>
      </TabsContent>
      <TabsContent value="register">
        <form onSubmit={handleRegisterSubmit(handleRegister)}>
          <CardHeader>
            <CardTitle>Daftar</CardTitle>
            <CardDescription>
              Buat akun baru dengan mengisi form di bawah ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="register-username">Username</Label>
              <Input
                id="register-username"
                placeholder="tony"
                {...registerForm('username', { required: 'Username wajib diisi' })}
              />
              {registerErrors.username && (
                <p className="text-red-500 text-sm">{registerErrors.username.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="register-name">Name</Label>
              <Input
                id="register-name"
                placeholder="tony"
                {...registerForm('name', { required: 'Name wajib diisi' })}
              />
              {registerErrors.name && (
                <p className="text-red-500 text-sm">{registerErrors.name.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="**"
                {...registerForm('password', { required: 'Password wajib diisi' })}
              />
              {registerErrors.password && (
                <p className="text-red-500 text-sm">{registerErrors.password.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirm-password">Konfirmasi</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="**"
                {...registerForm('confirmPassword', {
                  required: 'Konfirmasi password wajib diisi',
                })}
              />
              {registerErrors.confirmPassword && (
                <p className="text-red-500 text-sm">{registerErrors.confirmPassword.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <span className="spinner-border mr-2"></span>Memproses...
                </div>
              ) : (
                'Daftar'
              )}
            </Button>
          </CardFooter>
        </form>
      </TabsContent>
    </Tabs>
  );
}