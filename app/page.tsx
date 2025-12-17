import { LoginForm } from "@/components/login/login-form";

export default function Home() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src="/modern-office-workspace-with-natural-light-and-min.jpg"
          alt="Login background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-10 left-10 text-white">
          <h2 className="text-4xl font-bold text-balance">Добро пожаловать</h2>
          <p className="mt-2 text-lg text-white/90">Войдите в свой аккаунт</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
