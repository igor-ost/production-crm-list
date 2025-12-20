import { create } from "zustand";

type LocationState = {
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setByPath: (path: string) => void;
};

export const locationStore = create<LocationState>((set) => ({
  title: "Заказы",
  description: "Список ваших заказов",

  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),

  setByPath: (path) => {
    switch (path) {
      case "/customers":
        set({
          title: "Заказчики",
          description: "Список заказчиков",
        });
        break;
      
      case "/templates":
        set({
          title: "Шаблоны изделий",
          description: "Список шаблонов для изделий",
        });
        break;

      case "/orders":
        set({
          title: "Заказы",
          description: "Список ваших заказов",
        });
        break;
      case "/materials":
        set({
          title: "Материалы",
          description: "Список доступных материалов",
        });
        break;
      case "/journal":
        set({
          title: "Журнал",
          description: "Журнал выполненных работа",
        });
      break;
      case "/staff":
        set({
          title: "Персонал",
          description: "Список работников",
        });
        break;
      case "/reports":
        set({
          title: "Отчёты",
          description: "Генерация отчётов",
        });
        break;
      default:
        set({
          title: "Главная",
          description: "Обзор системы",
        });
    }
  },
}));
