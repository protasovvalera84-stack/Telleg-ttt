import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => { console.error("404 Error:", location.pathname); }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-600/8 rounded-full blur-3xl" />
      <div className="text-center relative z-10">
        <h1 className="mb-4 text-6xl font-extrabold text-gradient">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">Страница не найдена</p>
        <a href="/" className="text-sm text-violet-400 hover:text-violet-300 underline underline-offset-4 transition-colors">
          На главную
        </a>
      </div>
    </div>
  );
};

export default NotFound;
