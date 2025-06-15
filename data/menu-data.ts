export interface MenuItemPrice {
  label: string;
  value: number;
}

export interface MenuItem {
  name: string;
  description: string;
  prices: MenuItemPrice[];
  image: string;
  category: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export const menu: MenuCategory[] = [
  {
    name: "Hamburguesas",
    items: [
      {
        name: "LUIGII DE CARNE",
        description:
          "Carne de res, queso americano, lechuga, tomate, cebolla caramelizada, salsa luigii.",
        prices: [
          { label: "Sola", value: 4.5 },
          { label: "Con papas", value: 5.75 },
        ],
        image: "/menu/hamburger.jpeg",
        category: "Hamburguesas",
      },
      {
        name: "LUIGII DE CARNE CON BACON",
        description:
          "Carne de res, bacon, queso americano, lechuga, cebolla caramelizada, salsa luigii.",
        prices: [
          { label: "Sola", value: 5.25 },
          { label: "Con papas", value: 6.75 },
        ],
        image: "/menu/hamburger.jpeg",
        category: "Hamburguesas",
      },
      {
        name: "LUIGII DOBLE CARNE",
        description:
          "Doble carne de res, doble queso americano, lechuga, tomate, cebolla caramelizada, salsa luigii.",
        prices: [
          { label: "Sola", value: 6.5 },
          { label: "Con papas", value: 7.75 },
        ],
        image: "/menu/hamburger.jpeg",
        category: "Hamburguesas",
      },
      {
        name: "LUIGII DOBLE CARNE CON BACON",
        description:
          "Doble carne de res, doble queso americano, bacon, lechuga, cebolla caramelizada, salsa luigii.",
        prices: [
          { label: "Sola", value: 7.25 },
          { label: "Con papas", value: 8.75 },
        ],
        image: "/menu/hamburger.jpeg",
        category: "Hamburguesas",
      },
      {
        name: "LUIGII DE POLLO",
        description:
          "Pechuga de pollo apanada, queso americano, lechuga, tomate, cebolla caramelizada, salsa luigii.",
        prices: [
          { label: "Sola", value: 5.25 },
          { label: "Con papas", value: 6.75 },
        ],
        image: "/menu/hamburger.jpeg",
        category: "Hamburguesas",
      },
      {
        name: "LUIGII DE POLLO CON BACON",
        description:
          "Pechuga de pollo apanada, queso americano, bacon, lechuga, cebolla caramelizada, salsa luigii.",
        prices: [
          { label: "Sola", value: 5.75 },
          { label: "Con papas", value: 7.25 },
        ],
        image: "/menu/hamburger.jpeg",
        category: "Hamburguesas",
      },
    ],
  },
  {
    name: "Salchipapas",
    items: [
      {
        name: "SALCHIPAPA PEQUEÑA",
        description:
          "Papas fritas, carne molida, salchicha, salsa luigii, queso cheddar, ketchup.",
        prices: [{ label: "", value: 4.5 }],
        image: "/menu/hamburger.jpeg",
        category: "Salchipapas",
      },
      {
        name: "SALCHIPAPA GRANDE",
        description:
          "Papas, carne molida, salchicha, queso cheddar, ketchup. Para 1 o 2 personas.",
        prices: [{ label: "", value: 7.5 }],
        image: "/menu/hamburger.jpeg",
        category: "Salchipapas",
      },
    ],
  },
  {
    name: "Pollo",
    items: [
      {
        name: "ALITAS BBQ",
        description:
          "6 alitas bañadas en salsa barbecue, acompañadas de papas fritas.",
        prices: [{ label: "", value: 6.0 }],
        image: "/menu/hamburger.jpeg",
        category: "Pollo",
      },
      {
        name: "DEDITOS DE POLLO",
        description:
          "5 deditos de pollo apanados, acompañados de papas fritas y salsa luigii.",
        prices: [{ label: "", value: 5.5 }],
        image: "/menu/hamburger.jpeg",
        category: "Pollo",
      },
    ],
  },
  {
    name: "Varios",
    items: [
      {
        name: "TACOS",
        description:
          "Tortilla, lechuga, carne molida, salsa luigii, pico de gallo, queso cheddar. 3 unidades.",
        prices: [{ label: "", value: 5.25 }],
        image: "/menu/hamburger.jpeg",
        category: "Varios",
      },
      {
        name: "QUESADILLAS",
        description:
          "Tortilla, carne molida, cuatro quesos, pico de gallo y salsa luigii. 3 unidades.",
        prices: [{ label: "", value: 5.25 }],
        image: "/menu/hamburger.jpeg",
        category: "Varios",
      },
      {
        name: "NACHOS",
        description:
          "Nachos con carne molida, cuatro quesos, pico de gallo, queso cheddar, salsa luigii.",
        prices: [{ label: "", value: 7.0 }],
        image: "/menu/hamburger.jpeg",
        category: "Varios",
      },
    ],
  },
  {
    name: "Para Compartir",
    items: [
      {
        name: "BANDEJA",
        description:
          "2 hamburguesas de carne con bacon, 2 quesadillas, 1 salchipapa, 2 sodas.",
        prices: [{ label: "", value: 18.0 }],
        image: "/menu/hamburger.jpeg",
        category: "Para Compartir",
      },
    ],
  },
  {
    name: "Bebidas",
    items: [
      {
        name: "BATIDOS",
        description: "Fresa, piña, melón.",
        prices: [{ label: "", value: 2.75 }],
        image: "/menu/hamburger.jpeg",
        category: "Bebidas",
      },
      {
        name: "LICUADOS",
        description: "Fresa, piña, melón.",
        prices: [{ label: "", value: 2.5 }],
        image: "/menu/hamburger.jpeg",
        category: "Bebidas",
      },
      {
        name: "SODA DE LATA",
        description: "",
        prices: [{ label: "", value: 1.25 }],
        image: "/menu/hamburger.jpeg",
        category: "Bebidas",
      },
      {
        name: "BOTELLA DE AGUA",
        description: "",
        prices: [{ label: "", value: 1.0 }],
        image: "/menu/hamburger.jpeg",
        category: "Bebidas",
      },
    ],
  },
];
