export interface MenuItemPrice {
  label: string;
  value: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  prices: {
    size: string;
    label: string;
    value: number;
  }[];
  image?: string;
  category: string;
  hasFries?: boolean;
  hasFlavor?: boolean;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export const menu: MenuCategory[] = [
  {
    name: "LUIGII'S",
    items: [
      {
        id: 1,
        name: "LUIGII DE CARNE",
        description:
          "Pan de papa, carne de res, queso mozzarella, salsa de la casa.",
        prices: [
          { size: "small", label: "Pequeño", value: 3.5 },
          { size: "medium", label: "Mediano", value: 4.5 },
          { size: "large", label: "Grande", value: 5.5 },
        ],
        image: "/images/luigii-carne.jpg",
        category: "LUIGII'S",
        hasFries: true,
      },
      {
        id: 2,
        name: "LUIGII DE CARNE CON BACON",
        description:
          "Pan de papa, carne de res, queso mozzarella, bacon, salsa de la casa.",
        prices: [
          { size: "small", label: "Pequeño", value: 4.0 },
          { size: "medium", label: "Mediano", value: 5.0 },
          { size: "large", label: "Grande", value: 6.0 },
        ],
        image: "/images/luigii-carne-bacon.jpg",
        category: "LUIGII'S",
        hasFries: true,
      },
      {
        id: 3,
        name: "LUIGII DOBLE CARNE",
        description:
          "Doble carne de res, doble queso americano, lechuga, tomate, cebolla caramelizada, salsa luigii.",
        prices: [
          { size: "small", label: "Pequeño", value: 6.5 },
          { size: "medium", label: "Mediano", value: 7.75 },
          { size: "large", label: "Grande", value: 8.75 },
        ],
        image: "/menu/hamburger.jpeg",
        category: "LUIGII'S",
        hasFries: true,
      },
      {
        id: 4,
        name: "LUIGII DOBLE CARNE CON BACON",
        description:
          "Doble carne de res, doble queso americano, bacon, lechuga, cebolla caramelizada, salsa luigii.",
        prices: [
          { size: "small", label: "Pequeño", value: 7.25 },
          { size: "medium", label: "Mediano", value: 8.75 },
          { size: "large", label: "Grande", value: 9.75 },
        ],
        image: "/menu/hamburger.jpeg",
        category: "LUIGII'S",
        hasFries: true,
      },
      {
        id: 5,
        name: "LUIGII DE POLLO",
        description:
          "Pechuga de pollo apanada, queso americano, lechuga, tomate, cebolla caramelizada, salsa luigii.",
        prices: [
          { size: "small", label: "Pequeño", value: 5.25 },
          { size: "medium", label: "Mediano", value: 6.75 },
          { size: "large", label: "Grande", value: 7.75 },
        ],
        image: "/menu/hamburger.jpeg",
        category: "LUIGII'S",
        hasFries: true,
      },
      {
        id: 6,
        name: "LUIGII DE POLLO CON BACON",
        description:
          "Pechuga de pollo apanada, queso americano, bacon, lechuga, cebolla caramelizada, salsa luigii.",
        prices: [
          { size: "small", label: "Pequeño", value: 5.75 },
          { size: "medium", label: "Mediano", value: 7.25 },
          { size: "large", label: "Grande", value: 8.25 },
        ],
        image: "/menu/hamburger.jpeg",
        category: "LUIGII'S",
        hasFries: true,
      },
    ],
  },
  {
    name: "Salchipapas",
    items: [
      {
        id: 7,
        name: "SALCHIPAPA PEQUEÑA",
        description:
          "Papas fritas, carne molida, salchicha, salsa luigii, queso cheddar, ketchup.",
        prices: [{ size: "", label: "", value: 4.5 }],
        image: "/menu/hamburger.jpeg",
        category: "Salchipapas",
      },
      {
        id: 8,
        name: "SALCHIPAPA GRANDE",
        description:
          "Papas, carne molida, salchicha, queso cheddar, ketchup. Para 1 o 2 personas.",
        prices: [{ size: "", label: "", value: 7.5 }],
        image: "/menu/hamburger.jpeg",
        category: "Salchipapas",
      },
    ],
  },
  {
    name: "Pollo",
    items: [
      {
        id: 9,
        name: "ALITAS BBQ",
        description:
          "6 alitas bañadas en salsa barbecue, acompañadas de papas fritas.",
        prices: [{ size: "", label: "", value: 6.0 }],
        image: "/menu/hamburger.jpeg",
        category: "Pollo",
      },
      {
        id: 10,
        name: "DEDITOS DE POLLO",
        description:
          "5 deditos de pollo apanados, acompañados de papas fritas y salsa luigii.",
        prices: [{ size: "", label: "", value: 5.5 }],
        image: "/menu/hamburger.jpeg",
        category: "Pollo",
      },
    ],
  },
  {
    name: "Varios",
    items: [
      {
        id: 11,
        name: "TACOS",
        description:
          "Tortilla, lechuga, carne molida, salsa luigii, pico de gallo, queso cheddar. 3 unidades.",
        prices: [{ size: "", label: "", value: 5.25 }],
        image: "/menu/hamburger.jpeg",
        category: "Varios",
      },
      {
        id: 12,
        name: "QUESADILLAS",
        description:
          "Tortilla, carne molida, cuatro quesos, pico de gallo y salsa luigii. 3 unidades.",
        prices: [{ size: "", label: "", value: 5.25 }],
        image: "/menu/hamburger.jpeg",
        category: "Varios",
      },
      {
        id: 13,
        name: "NACHOS",
        description:
          "Nachos con carne molida, cuatro quesos, pico de gallo, queso cheddar, salsa luigii.",
        prices: [{ size: "", label: "", value: 7.0 }],
        image: "/menu/hamburger.jpeg",
        category: "Varios",
      },
    ],
  },
  {
    name: "Para Compartir",
    items: [
      {
        id: 14,
        name: "BANDEJA",
        description:
          "2 hamburguesas de carne con bacon, 2 quesadillas, 1 salchipapa, 2 sodas.",
        prices: [{ size: "", label: "", value: 18.0 }],
        image: "/menu/hamburger.jpeg",
        category: "Para Compartir",
      },
    ],
  },
  {
    name: "Bebidas",
    items: [
      {
        id: 15,
        name: "BATIDOS",
        description: "Fresa, piña, melón.",
        prices: [
          { size: "", label: "Fresa", value: 2.75 },
          { size: "", label: "Piña", value: 2.75 },
          { size: "", label: "Melón", value: 2.75 },
        ],
        image: "/menu/hamburger.jpeg",
        category: "Bebidas",
      },
      {
        id: 16,
        name: "LICUADOS",
        description: "Fresa, piña, melón.",
        prices: [
          { size: "", label: "Fresa", value: 2.5 },
          { size: "", label: "Piña", value: 2.5 },
          { size: "", label: "Melón", value: 2.5 },
        ],
        image: "/menu/hamburger.jpeg",
        category: "Bebidas",
      },
      {
        id: 17,
        name: "SODA DE LATA",
        description: "",
        prices: [{ size: "", label: "", value: 1.25 }],
        image: "/menu/hamburger.jpeg",
        category: "Bebidas",
      },
      {
        id: 18,
        name: "BOTELLA DE AGUA",
        description: "",
        prices: [{ size: "", label: "", value: 1.0 }],
        image: "/menu/hamburger.jpeg",
        category: "Bebidas",
      },
    ],
  },
];
