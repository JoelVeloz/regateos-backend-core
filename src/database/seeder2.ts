import * as fs from 'fs';
import * as path from 'path';

import { PrismaClient } from '@prisma/client';
import { auth } from '../auth/auth.config';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Arrays expandidos de datos para mayor variedad
const nombres = [
  'Maria Garcia',
  'Carlos Lopez',
  'Ana Martinez',
  'Jose Rodriguez',
  'Laura Sanchez',
  'Miguel Gonzalez',
  'Carmen Perez',
  'Antonio Jimenez',
  'Isabel Ruiz',
  'Francisco Moreno',
  'Elena Vargas',
  'Roberto Silva',
  'Patricia Morales',
  'Fernando Castro',
  'Monica Herrera',
  'Diego Ramirez',
  'Sofia Torres',
  'Andres Vega',
  'Valentina Flores',
  'Sebastian Rojas',
  'Camila Gutierrez',
  'Nicolas Mendoza',
  'Isabella Cruz',
  'Gabriel Ortega',
  'Daniela Reyes',
  'Alejandro Munoz',
  'Valeria Aguilar',
  'Santiago Delgado',
  'Natalia Pena',
  'Mateo Guerrero',
  'Emilia Sandoval',
  'Leonardo Castillo',
  'Adriana Fuentes',
  'Emilio Ramos',
  'Lucia Medina',
  'Maximiliano Contreras',
  'Renata Espinoza',
  'Thiago Valdez',
  'Antonella Navarro',
  'Bautista Molina',
  'Catalina Figueroa',
  'Ignacio Campos',
  'Constanza Salinas',
  'Agustin Guerrero',
  'Javiera Paredes',
  'Matias Leon',
  'Trinidad Rios',
  'Benjamin Mendez',
  'Amanda Cortes',
  'Dante Herrera',
  'Florencia Vargas',
  'Luciano Silva',
  'Antonia Morales',
  'Emiliano Castro',
  'Josefina Herrera',
  'Tomas Ramirez',
  'Magdalena Torres',
  'Vicente Vega',
  'Francisca Flores',
  'Cristobal Rojas',
  'Catalina Gutierrez',
  'Joaquin Mendoza',
  'Isidora Cruz',
  'Agustin Ortega',
  'Trinidad Reyes',
  'Matias Munoz',
  'Antonia Aguilar',
  'Emilio Delgado',
  'Josefina Pena',
  'Benjamin Guerrero',
  'Francisca Sandoval',
  'Vicente Castillo',
  'Magdalena Fuentes',
  'Tomas Ramos',
  'Catalina Medina',
  'Joaquin Contreras',
  'Isidora Espinoza',
  'Agustin Valdez',
  'Trinidad Navarro',
  'Matias Molina',
  'Antonia Figueroa',
  'Emilio Campos',
  'Josefina Salinas',
  'Benjamin Guerrero',
  'Francisca Paredes',
  'Vicente Leon',
  'Magdalena Rios',
  'Tomas Mendez',
  'Catalina Cortes',
  'Joaquin Herrera',
  'Isidora Vargas',
  'Agustin Silva',
  'Trinidad Morales',
  'Matias Castro',
  'Antonia Herrera',
  'Emilio Ramirez',
  'Josefina Torres',
  'Benjamin Vega',
  'Francisca Flores',
  'Vicente Rojas',
  'Magdalena Gutierrez',
  'Tomas Mendoza',
  'Catalina Cruz',
  'Joaquin Ortega',
  'Isidora Reyes',
];

const nombresNegocios = [
  'Supermercado El Ahorro',
  'Farmacia San Jose',
  'Boutique Elegante',
  'Electrodomesticos Plus',
  'Frutas Frescas',
  'Carniceria Don Juan',
  'Panaderia La Esperanza',
  'Ferreteria El Constructor',
  'Papeleria Escolar',
  'Joyeria Reluciente',
  'Restaurante El Buen Sabor',
  'Libreria Universitaria',
  'Tienda de Deportes',
  'Optica Vision Clara',
  'Floristeria Rosas Blancas',
  'Peluqueria Estilo',
  'Taller Mecanico Rápido',
  'Clinica Dental Sonrisa',
  'Gimnasio Fitness Total',
  'Cafeteria Aroma',
  'Tienda de Mascotas',
  'Lavanderia Express',
  'Reposteria Dulce Tentacion',
  'Tienda de Computadoras',
  'Zapateria El Caminante',
  'Tienda de Ropa Moda',
  'Farmacia 24 Horas',
  'Supermercado Familiar',
  'Tienda de Regalos',
  'Estetica Belleza Natural',
  'Taller de Bicicletas',
  'Tienda de Juguetes',
  'Ferreteria Industrial',
  'Tienda de Electrodomesticos',
  'Carniceria Premium',
  'Panaderia Artesanal',
  'Tienda de Deportes Acuaticos',
  'Optica Moderna',
  'Floristeria Exotica',
  'Peluqueria Unisex',
  'Taller de Motos',
  'Clinica Veterinaria',
  'Gimnasio Crossfit',
  'Cafeteria Gourmet',
  'Tienda de Aves',
  'Lavanderia Industrial',
  'Reposteria Francesa',
  'Tienda de Gaming',
  'Zapateria Deportiva',
  'Tienda de Ropa Infantil',
  'Farmacia Natural',
  'Supermercado Organico',
  'Tienda de Artesanias',
  'Estetica Spa',
  'Taller de Autos',
  'Tienda de Bebes',
  'Ferreteria Hogar',
  'Tienda de Audio',
  'Carniceria Gourmet',
  'Panaderia Integral',
  'Tienda de Camping',
  'Optica Deportiva',
  'Floristeria Eventos',
  'Peluqueria Canina',
  'Taller de Refrigeracion',
  'Clinica Estetica',
  'Gimnasio Pilates',
  'Cafeteria Vegana',
  'Tienda de Reptiles',
  'Lavanderia Ecologica',
  'Reposteria Italiana',
  'Tienda de Drones',
  'Zapateria Formal',
  'Tienda de Ropa Deportiva',
  'Farmacia Homeopatica',
  'Supermercado Gourmet',
  'Tienda de Antiguedades',
  'Estetica Masculina',
  'Taller de Electronica',
  'Tienda de Mascotas Exoticas',
  'Ferreteria Agricola',
  'Tienda de Musica',
  'Carniceria Halal',
  'Panaderia Gluten Free',
  'Tienda de Surf',
  'Optica Infantil',
  'Floristeria Funeral',
  'Peluqueria Afro',
  'Taller de Aires',
  'Clinica Alternativa',
  'Gimnasio Yoga',
  'Cafeteria Artesanal',
  'Tienda de Peces',
  'Lavanderia Express 24h',
  'Reposteria Alemana',
  'Tienda de Realidad Virtual',
  'Zapateria Casual',
  'Tienda de Ropa Vintage',
  'Farmacia Pediatrica',
  'Supermercado Internacional',
];

const ciudades = [
  'Guayaquil',
  'Duran',
  'Samborondon',
  'Nobol',
  'Milagro',
  'Yaguachi',
  'Salitre',
  'Playas',
  'Santa Elena',
  'La Libertad',
  'Manta',
  'Portoviejo',
  'Quevedo',
  'Babahoyo',
  'Ventanas',
  'Balzar',
  'Colimes',
  'Palestina',
  'Isidro Ayora',
  'Lomas de Sargentillo',
  'Naranjal',
  'Balao',
  'El Triunfo',
  'General Villamil',
  'Jujan',
  'Marcelino Mariduenas',
  'Naranjito',
  'Pueblo Viejo',
  'San Jacinto de Yaguachi',
  'Simón Bolívar',
  'Coronel Marcelino Maridueña',
];

const categoriasProductos = [
  { name: 'Electrodomesticos', icon: 'Home' },
  { name: 'Ropa', icon: 'Shirt' },
  { name: 'Alimentacion', icon: 'Apple' },
  { name: 'Salud', icon: 'Heart' },
  { name: 'Hogar', icon: 'House' },
  { name: 'Deportes', icon: 'Dumbbell' },
  { name: 'Tecnologia', icon: 'Smartphone' },
  { name: 'Papeleria', icon: 'BookOpen' },
  { name: 'Juguetes', icon: 'Toy' },
  { name: 'Automotriz', icon: 'Car' },
  { name: 'Belleza', icon: 'Sparkles' },
  { name: 'Jardineria', icon: 'TreePine' },
  { name: 'Mascotas', icon: 'Dog' },
  { name: 'Musica', icon: 'Music' },
  { name: 'Fotografia', icon: 'Camera' },
  { name: 'Viajes', icon: 'Plane' },
  { name: 'Oficina', icon: 'Briefcase' },
  { name: 'Cocina', icon: 'ChefHat' },
  { name: 'Bebes', icon: 'Baby' },
  { name: 'Fitness', icon: 'Activity' },
  { name: 'Camping', icon: 'Tent' },
  { name: 'Pesca', icon: 'Fish' },
  { name: 'Caza', icon: 'Target' },
  { name: 'Artesanias', icon: 'Palette' },
  { name: 'Libros', icon: 'Book' },
  { name: 'Peliculas', icon: 'Film' },
  { name: 'Videojuegos', icon: 'Gamepad2' },
  { name: 'Instrumentos', icon: 'Guitar' },
  { name: 'Herramientas', icon: 'Wrench' },
  { name: 'Construccion', icon: 'Hammer' },
];

const productosEjemplo = [
  // Electrodomesticos
  { name: 'Smartphone Samsung Galaxy', description: 'Telefono inteligente de ultima generacion con camara profesional' },
  { name: 'Laptop HP Pavilion', description: 'Computadora portatil ideal para trabajo y entretenimiento' },
  { name: 'Refrigerador LG', description: 'Refrigerador de 350L con tecnologia inverter' },
  { name: 'Lavadora Samsung', description: 'Lavadora automatica de 8kg con tecnologia eco bubble' },
  { name: 'Microondas Panasonic', description: 'Horno microondas de 25L con grill y conveccion' },
  { name: 'Televisor Sony 55"', description: 'Smart TV 4K con Android TV integrado' },
  { name: 'Aire Acondicionado Daikin', description: 'Split inverter 12000 BTU clase A++' },
  { name: 'Aspiradora Dyson', description: 'Aspiradora sin cable con tecnologia ciclonica' },
  { name: 'Licuadora Oster', description: 'Licuadora de 6 velocidades con jarra de vidrio' },
  { name: 'Plancha Philips', description: 'Plancha de vapor con sistema anti-cal' },

  // Ropa
  { name: 'Zapatillas Nike Air Max', description: 'Zapatillas deportivas comodas y duraderas' },
  { name: 'Camisa Polo', description: 'Camisa de algodon premium para ocasiones especiales' },
  { name: 'Pantalon Jeans', description: 'Jeans clasicos de mezclilla azul' },
  { name: 'Vestido de Noche', description: 'Vestido largo para ocasiones especiales' },
  { name: 'Chaqueta de Cuero', description: 'Chaqueta de cuero genuino estilo motociclista' },
  { name: 'Sudadera Adidas', description: 'Sudadera con capucha para deporte y casual' },
  { name: 'Traje de Baño', description: 'Bikini de dos piezas con estampado tropical' },
  { name: 'Botas de Seguridad', description: 'Botas industriales con puntera de acero' },
  { name: 'Gorra de Beisbol', description: 'Gorra ajustable con logo bordado' },
  { name: 'Bufanda de Lana', description: 'Bufanda tejida a mano en lana merino' },

  // Alimentacion
  { name: 'Aceite de Oliva Extra Virgen', description: 'Aceite de oliva de primera calidad, 500ml' },
  { name: 'Cafe en Grano', description: 'Cafe premium tostado, paquete de 1kg' },
  { name: 'Miel de Abeja Natural', description: 'Miel pura de flores silvestres, 500g' },
  { name: 'Chocolate Artesanal', description: 'Chocolate negro 70% cacao, tableta 100g' },
  { name: 'Arroz Integral', description: 'Arroz integral organico, bolsa 2kg' },
  { name: 'Quinoa Real', description: 'Quinoa organica de los Andes, 500g' },
  { name: 'Aceitunas Verdes', description: 'Aceitunas verdes rellenas de anchoa, 200g' },
  { name: 'Vinagre Balsamico', description: 'Vinagre balsamico de Modena, 250ml' },
  { name: 'Especias Mixtas', description: 'Mezcla de especias para cocina mediterranea' },
  { name: 'Frutos Secos', description: 'Mezcla de nueces, almendras y pasas, 300g' },

  // Salud
  { name: 'Champu Pantene Pro-V', description: 'Champu reparador para cabello danado, 400ml' },
  { name: 'Crema Facial', description: 'Crema hidratante para piel sensible' },
  { name: 'Vitamina C', description: 'Suplemento de vitamina C 1000mg, 60 capsulas' },
  { name: 'Termometro Digital', description: 'Termometro digital infrarrojo sin contacto' },
  { name: 'Tensiómetro Omron', description: 'Monitor de presion arterial automatico' },
  { name: 'Mascarilla N95', description: 'Mascarilla de proteccion respiratoria, caja 50 unidades' },
  { name: 'Alcohol en Gel', description: 'Gel antibacterial 70% alcohol, 500ml' },
  { name: 'Protector Solar', description: 'Bloqueador solar FPS 50+ resistente al agua' },
  { name: 'Shampoo Anticaspa', description: 'Shampoo medicado para caspa severa, 400ml' },
  { name: 'Crema para Pies', description: 'Crema hidratante para pies secos y agrietados' },

  // Hogar
  { name: 'Sofa 3 Plazas', description: 'Sofa moderno y comodo para sala de estar' },
  { name: 'Mesa de Comedor', description: 'Mesa de madera maciza para comedor familiar' },
  { name: 'Cama King Size', description: 'Cama king size con cabecera tapizada' },
  { name: 'Cortinas Blackout', description: 'Cortinas opacas para dormitorio, 2 paneles' },
  { name: 'Alfombra Persa', description: 'Alfombra persa autentica, 2x3 metros' },
  { name: 'Lampara de Mesa', description: 'Lampara LED con brazo ajustable' },
  { name: 'Espejo de Pared', description: 'Espejo decorativo con marco dorado' },
  { name: 'Cojines Decorativos', description: 'Set de 4 cojines con estampado geometrico' },
  { name: 'Organizador de Ropa', description: 'Organizador de armario con 6 compartimentos' },
  { name: 'Aspiradora Robot', description: 'Robot aspiradora con programacion automatica' },

  // Deportes
  { name: 'Pelota de Futbol', description: 'Pelota oficial para futbol, tamano 5' },
  { name: 'Raqueta de Tenis', description: 'Raqueta profesional para tenis' },
  { name: 'Bicicleta de Montaña', description: 'Bicicleta todo terreno con suspension delantera' },
  { name: 'Pesas Ajustables', description: 'Set de pesas ajustables de 2.5kg a 25kg' },
  { name: 'Colchoneta de Yoga', description: 'Colchoneta antideslizante para yoga y pilates' },
  { name: 'Cuerda para Saltar', description: 'Cuerda de saltar profesional con contador' },
  { name: 'Balon de Baloncesto', description: 'Balon oficial de baloncesto, tamano 7' },
  { name: 'Guantes de Boxeo', description: 'Guantes de boxeo profesionales, 16oz' },
  { name: 'Mancuernas Hexagonales', description: 'Par de mancuernas hexagonales de 10kg' },
  { name: 'Cinta de Correr', description: 'Cinta de correr electrica plegable' },

  // Tecnologia
  { name: 'Tablet iPad Air', description: 'Tablet Apple con pantalla retina de 10.9 pulgadas' },
  { name: 'Monitor Samsung 24"', description: 'Monitor LED full HD para computadora' },
  { name: 'Teclado Mecanico', description: 'Teclado mecanico gaming con retroiluminacion RGB' },
  { name: 'Mouse Inalambrico', description: 'Mouse optico inalambrico con receptor USB' },
  { name: 'Auriculares Bluetooth', description: 'Auriculares inalambricos con cancelacion de ruido' },
  { name: 'Webcam HD', description: 'Camara web 1080p con microfono integrado' },
  { name: 'Disco Duro Externo', description: 'Disco duro externo 1TB USB 3.0' },
  { name: 'Router WiFi 6', description: 'Router inalambrico de alta velocidad WiFi 6' },
  { name: 'Cargador Inalambrico', description: 'Base de carga inalambrica para smartphone' },
  { name: 'Smartwatch', description: 'Reloj inteligente con GPS y monitor cardiaco' },

  // Papeleria
  { name: 'Libro "El Quijote"', description: 'Edicion especial de la obra maestra de Cervantes' },
  { name: 'Cuaderno Universitario', description: 'Cuaderno de 200 hojas con espiral metalico' },
  { name: 'Boligrafo Parker', description: 'Boligrafo de lujo con punta de oro' },
  { name: 'Calculadora Cientifica', description: 'Calculadora grafica con pantalla a color' },
  { name: 'Mochila Escolar', description: 'Mochila resistente al agua con compartimentos' },
  { name: 'Estuche de Lapices', description: 'Estuche con 24 lapices de colores' },
  { name: 'Regla de 30cm', description: 'Regla transparente con medidas metricas' },
  { name: 'Goma de Borrar', description: 'Goma de borrar blanca sin residuos' },
  { name: 'Tijeras de Oficina', description: 'Tijeras ergonomicas para uso profesional' },
  { name: 'Grapadora', description: 'Grapadora de escritorio con capacidad 20 hojas' },

  // Juguetes
  { name: 'Muneca Barbie', description: 'Muneca Barbie con vestidos de moda' },
  { name: 'Carro de Control Remoto', description: 'Carro de carreras con control remoto 2.4GHz' },
  { name: 'Lego Creator', description: 'Set de construccion Lego con 1000 piezas' },
  { name: 'Puzzle 1000 Piezas', description: 'Puzzle de paisaje montanoso, 1000 piezas' },
  { name: 'Juego de Mesa Monopoly', description: 'Juego clasico de Monopoly en espanol' },
  { name: 'Pelota de Plastico', description: 'Pelota de playa inflable, 50cm diametro' },
  { name: 'Muñeco de Peluche', description: 'Oso de peluche suave, 30cm altura' },
  { name: 'Kit de Pintura', description: 'Set de pinturas acrilicas con 12 colores' },
  { name: 'Trompo de Madera', description: 'Trompo tradicional de madera con cuerda' },
  { name: 'Yo-yo Profesional', description: 'Yo-yo de precision con sistema de retorno' },

  // Automotriz
  { name: 'Neumatico Michelin', description: 'Neumatico de alta calidad para automovil' },
  { name: 'Aceite de Motor', description: 'Aceite sintetico 5W-30, 4 litros' },
  { name: 'Filtro de Aire', description: 'Filtro de aire para motor de combustion' },
  { name: 'Bateria de Auto', description: 'Bateria de 12V 60Ah para automovil' },
  { name: 'Liquido de Frenos', description: 'Liquido de frenos DOT 4, 500ml' },
  { name: 'Anticongelante', description: 'Anticongelante concentrado, 1 litro' },
  { name: 'Limpiaparabrisas', description: 'Juego de limpiaparabrisas delanteros' },
  { name: 'Fusibles de Auto', description: 'Kit de fusibles de diferentes amperajes' },
  { name: 'Cable de Arranque', description: 'Cables de arranque 4 metros, 25mm2' },
  { name: 'Herramientas de Auto', description: 'Juego de herramientas basicas para automovil' },
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRandomEmail(name: string, index: number): string {
  const domains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'empresarial.com', 'negocio.com'];
  const namePart = name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c');
  const randomNum = Math.floor(Math.random() * 1000) + index;
  const domain = getRandomElement(domains);
  return `${namePart}${randomNum}@${domain}`;
}

function generateRandomPhone(): string {
  const prefixes = ['+593', '+1', '+52', '+39', '+33'];
  const prefix = getRandomElement(prefixes);
  const number = Math.floor(Math.random() * 900000000) + 100000000;
  return `${prefix}${number}`;
}

function generateRandomPrice(min: number = 5, max: number = 2000): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function generateRandomDiscount(): { percent?: number; fixed?: number } {
  const hasDiscount = Math.random() > 0.7; // 30% de probabilidad de tener descuento

  if (!hasDiscount) return {};

  const discountType = Math.random() > 0.5;

  if (discountType) {
    return { percent: Math.floor(Math.random() * 40) + 5 }; // 5% a 45%
  } else {
    return { fixed: generateRandomPrice(5, 100) };
  }
}

async function createMerchantProductsAndCategories() {
  try {
    // Buscar el usuario merchant
    const merchantUser = await prisma.user.findUnique({
      where: { email: 'joel.edu.v@gmail.com' },
      include: { merchant: true },
    });

    if (!merchantUser || !merchantUser.merchant) {
      console.log('⚠️  Usuario merchant no encontrado, saltando creación de productos y categorías');
      return;
    }

    const merchant = merchantUser.merchant;
    console.log(`🛍️  Creando productos y categorías para ${merchant.businessName}...`);

    // Crear 3 categorías específicas para el merchant
    const categoriasMerchant = [
      { name: 'Tecnologia', icon: 'Smartphone' },
      { name: 'Electrodomesticos', icon: 'Home' },
      { name: 'Accesorios', icon: 'Shirt' },
    ];

    const categorias: any[] = [];
    for (const categoriaData of categoriasMerchant) {
      const categoria = await prisma.category.create({
        data: {
          id: uuidv4(),
          name: categoriaData.name,
          icon: categoriaData.icon,
          merchantId: merchant.id,
          status: 'active',
        },
      });
      categorias.push(categoria);
    }

    // Crear 10 productos específicos para el merchant
    const productosMerchant = [
      {
        name: 'iPhone 15 Pro Max',
        description: 'El smartphone más avanzado de Apple con cámara profesional',
        price: 1299.99,
        category: categorias[0],
      },
      { name: 'MacBook Air M3', description: 'Laptop ultradelgada con chip M3 para máxima productividad', price: 1199.99, category: categorias[0] },
      { name: 'Samsung Galaxy S24 Ultra', description: 'Smartphone Android premium con S Pen incluido', price: 1199.99, category: categorias[0] },
      { name: 'iPad Pro 12.9"', description: 'Tablet profesional con pantalla Liquid Retina XDR', price: 1099.99, category: categorias[0] },
      {
        name: 'Refrigerador Samsung Smart',
        description: 'Refrigerador inteligente con pantalla táctil y WiFi',
        price: 1899.99,
        category: categorias[1],
      },
      {
        name: 'Lavadora LG TurboWash',
        description: 'Lavadora de carga frontal con tecnología TurboWash 360°',
        price: 899.99,
        category: categorias[1],
      },
      {
        name: 'Microondas Panasonic Inverter',
        description: 'Horno microondas con tecnología Inverter y grill',
        price: 299.99,
        category: categorias[1],
      },
      {
        name: 'Auriculares AirPods Pro',
        description: 'Auriculares inalámbricos con cancelación activa de ruido',
        price: 249.99,
        category: categorias[2],
      },
      { name: 'Apple Watch Series 9', description: 'Reloj inteligente con GPS y monitor de salud avanzado', price: 399.99, category: categorias[2] },
      { name: 'Cargador MagSafe', description: 'Cargador magnético inalámbrico para iPhone', price: 39.99, category: categorias[2] },
    ];

    for (let i = 0; i < productosMerchant.length; i++) {
      const productoData = productosMerchant[i];

      const producto = await prisma.product.create({
        data: {
          id: uuidv4(),
          name: productoData.name,
          price: productoData.price,
          description: productoData.description,
          categoryId: productoData.category.id,
          merchantId: merchant.id,
          discountPercent: i < 3 ? 10 : null, // Primeros 3 productos con 10% descuento
          discountFixed: null,
          status: 'active',
        },
      });

      // Crear 2-3 imágenes por producto
      const numImagenes = Math.floor(Math.random() * 2) + 2; // 2-3 imágenes
      for (let j = 0; j < numImagenes; j++) {
        await prisma.file.create({
          data: {
            id: uuidv4(),
            filename: `product_${producto.id}_${j + 1}.jpg`,
            originalName: `product_image_${j + 1}.jpg`,
            path: `/uploads/products/${producto.id}/image_${j + 1}.jpg`,
            url: `https://picsum.photos/500/500?random=merchant${i * 10 + j}`,
            provider: 'local',
            mimeType: 'image/jpeg',
            size: Math.floor(Math.random() * 1000000) + 200000,
            productId: producto.id,
          },
        });
      }
    }

    console.log(`✅ Creadas ${categorias.length} categorías y ${productosMerchant.length} productos para ${merchant.businessName}`);
  } catch (error) {
    console.error('❌ Error creando productos y categorías para merchant:', error);
  }
}

async function createUserWithData(userIndex: number, credentials: Array<{ email: string; password: string; name: string }>) {
  const nombre = nombres[userIndex % nombres.length];
  const email = generateRandomEmail(nombre, userIndex);
  const telefono = generateRandomPhone();
  const ciudad = getRandomElement(ciudades);
  const nombreNegocio = nombresNegocios[userIndex % nombresNegocios.length];
  const password = '12345678';

  console.log(`Creando usuario ${userIndex + 1}/100: ${nombre} - ${email}`);

  try {
    // Crear usuario usando Better Auth
    const signUpResult = await auth.api.signUpEmail({
      body: {
        email: email,
        password: password,
        name: nombre,
      },
    });

    if (!signUpResult.user) {
      throw new Error('Error al crear usuario: No se pudo crear el usuario');
    }

    const user = signUpResult.user;

    // Guardar credenciales
    credentials.push({
      email: email,
      password: password,
      name: nombre,
    });

    // Crear archivos para el merchant
    const businessLogoId = uuidv4();
    const nationalIdImageId = uuidv4();
    const storeFrontImageId = uuidv4();

    await prisma.file.createMany({
      data: [
        {
          id: businessLogoId,
          filename: `business_logo_${user.id}.jpg`,
          originalName: 'business_logo.jpg',
          path: `/uploads/merchants/${user.id}/business_logo.jpg`,
          url: `https://picsum.photos/200/200?random=${userIndex + 1}`,
          provider: 'local',
          mimeType: 'image/jpeg',
          size: Math.floor(Math.random() * 500000) + 100000,
        },
        {
          id: nationalIdImageId,
          filename: `national_id_${user.id}.jpg`,
          originalName: 'national_id.jpg',
          path: `/uploads/merchants/${user.id}/national_id.jpg`,
          url: `https://picsum.photos/400/300?random=${userIndex + 100}`,
          provider: 'local',
          mimeType: 'image/jpeg',
          size: Math.floor(Math.random() * 800000) + 200000,
        },
        {
          id: storeFrontImageId,
          filename: `store_front_${user.id}.jpg`,
          originalName: 'store_front.jpg',
          path: `/uploads/merchants/${user.id}/store_front.jpg`,
          url: `https://picsum.photos/600/400?random=${userIndex + 200}`,
          provider: 'local',
          mimeType: 'image/jpeg',
          size: Math.floor(Math.random() * 1200000) + 300000,
        },
      ],
    });

    // Crear merchant asociado al usuario
    const merchant = await prisma.merchant.create({
      data: {
        userId: user.id,
        verified: Math.random() > 0.2, // 80% verificados
        businessName: nombreNegocio,
        businessAddress: `${getRandomElement(['Calle', 'Avenida', 'Plaza', 'Boulevard'])} ${Math.floor(Math.random() * 1000) + 1}, ${ciudad}`,
        nationalId: `${Math.floor(Math.random() * 90000000) + 10000000}`,
        city: ciudad,
        phone: telefono,
        businessLogoId,
        nationalIdImageId,
        storeFrontImageId,
      },
    });

    // Crear categorías para el usuario (10-20 categorías por usuario)
    const numCategorias = Math.floor(Math.random() * 11) + 10; // 10 a 20 categorías
    const categoriasSeleccionadas = getRandomElements(categoriasProductos, numCategorias);

    const categorias: any[] = [];
    for (let i = 0; i < categoriasSeleccionadas.length; i++) {
      const categoriaData = categoriasSeleccionadas[i];
      const nombreUnico = `${categoriaData.name}`;

      const categoria = await prisma.category.create({
        data: {
          id: uuidv4(),
          name: nombreUnico,
          icon: categoriaData.icon,
          merchantId: merchant.id,
          status: 'active',
        },
      });
      categorias.push(categoria);
    }

    // Crear productos para el usuario (50-250 productos)
    const numProductos = Math.floor(Math.random() * 201) + 50; // 50 a 250 productos
    const productosSeleccionados = getRandomElements(productosEjemplo, Math.min(numProductos, productosEjemplo.length));

    for (let i = 0; i < numProductos; i++) {
      const productoData = productosSeleccionados[i % productosSeleccionados.length];
      const categoria = getRandomElement(categorias);
      const precio = generateRandomPrice();
      const descuento = generateRandomDiscount();

      // Crear producto con variaciones en el nombre para evitar duplicados
      const nombreProducto = i < productosSeleccionados.length ? productoData.name : `${productoData.name} - Variante ${i + 1}`;

      const producto = await prisma.product.create({
        data: {
          id: uuidv4(),
          name: nombreProducto,
          price: precio,
          description: `${productoData.description} - Disponible en ${nombreNegocio}`,
          categoryId: categoria.id,
          merchantId: merchant.id,
          discountPercent: descuento.percent || null,
          discountFixed: descuento.fixed || null,
          status: Math.random() > 0.05 ? 'active' : 'inactive', // 95% activos
        },
      });

      // Crear 1-4 imágenes por producto
      const numImagenes = Math.floor(Math.random() * 4) + 1;
      const imagenesProducto: any[] = [];

      for (let j = 0; j < numImagenes; j++) {
        const imagen = await prisma.file.create({
          data: {
            id: uuidv4(),
            filename: `product_${producto.id}_${j + 1}.jpg`,
            originalName: `product_image_${j + 1}.jpg`,
            path: `/uploads/products/${producto.id}/image_${j + 1}.jpg`,
            url: `https://picsum.photos/500/500?random=${userIndex * 1000 + i * 100 + j}`,
            provider: 'local',
            mimeType: 'image/jpeg',
            size: Math.floor(Math.random() * 1000000) + 200000,
            productId: producto.id,
          },
        });
        imagenesProducto.push(imagen);
      }
    }

    console.log(`✅ Usuario ${userIndex + 1} creado con ${categorias.length} categorías y ${numProductos} productos`);
    return user;
  } catch (error) {
    console.error(`❌ Error creando usuario ${userIndex + 1}:`, error);
    throw error;
  }
}

export async function seedDatabase2() {
  console.log('🌱 Iniciando proceso de inicialización masiva de la base de datos...');
  console.log('📊 Generando 100 usuarios con merchants, 10-20 categorías y 50-250 productos cada uno');
  console.log('⚠️  NOTA: Los usuarios admin@regateos.com y joel.edu.v@gmail.com se crean automáticamente al iniciar el servicio');

  // Array para almacenar credenciales
  const credentials: Array<{ email: string; password: string; name: string }> = [];

  try {
    // Limpiar datos existentes (excepto usuarios admin y merchant)
    console.log('🧹 Limpiando datos existentes (preservando usuarios admin y merchant)...');
    await prisma.file.deleteMany({
      where: {
        productId: { not: null },
      },
    });
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.merchant.deleteMany({
      where: {
        user: {
          email: {
            notIn: ['admin@regateos.com', 'joel.edu.v@gmail.com'],
          },
        },
      },
    });
    await prisma.user.deleteMany({
      where: {
        email: {
          notIn: ['admin@regateos.com', 'joel.edu.v@gmail.com'],
        },
      },
    });

    console.log('🛍️  Creando productos y categorías para joel.edu.v@gmail.com...');

    // Crear productos y categorías para el usuario merchant
    await createMerchantProductsAndCategories();

    console.log('👥 Creando 100 usuarios con datos masivos...');

    // Crear 100 usuarios en lotes para mejor rendimiento
    const batchSize = 10;
    for (let batch = 0; batch < 10; batch++) {
      console.log(`\n📦 Procesando lote ${batch + 1}/10...`);

      const promises: Promise<any>[] = [];
      for (let i = 0; i < batchSize; i++) {
        const userIndex = batch * batchSize + i;
        promises.push(createUserWithData(userIndex, credentials));
      }

      await Promise.all(promises);
      console.log(`✅ Lote ${batch + 1} completado`);
    }

    // Guardar credenciales en archivo de texto
    const credentialsPath = path.join(process.cwd(), 'credentials2.txt');
    const credentialsContent = credentials
      .map((cred, index) => `Usuario ${index + 1}:\n` + `  Nombre: ${cred.name}\n` + `  Email: ${cred.email}\n` + `  Contraseña: ${cred.password}\n`)
      .join('\n');

    fs.writeFileSync(credentialsPath, credentialsContent, 'utf8');
    console.log(`📝 Credenciales guardadas en: ${credentialsPath}`);

    // Obtener estadísticas finales
    const userCount = await prisma.user.count();
    const merchantCount = await prisma.merchant.count();
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();
    const fileCount = await prisma.file.count();

    console.log('\n🎉 ¡Inicialización masiva completada exitosamente!');
    console.log(`📊 Estadísticas finales:`);
    console.log(`   - Usuarios: ${userCount} (incluye admin y merchant)`);
    console.log(`   - Merchants: ${merchantCount}`);
    console.log(`   - Categorías: ${categoryCount}`);
    console.log(`   - Productos: ${productCount}`);
    console.log(`   - Archivos: ${fileCount}`);
    console.log(`\n📈 Promedios por usuario:`);
    console.log(`   - Categorías por usuario: ${(categoryCount / (userCount - 2)).toFixed(1)}`);
    console.log(`   - Productos por usuario: ${(productCount / (userCount - 2)).toFixed(1)}`);
    console.log(`   - Archivos por usuario: ${(fileCount / (userCount - 2)).toFixed(1)}`);

    console.log(`\n🔑 Primeras 10 credenciales de acceso:`);
    credentials.slice(0, 10).forEach((cred, index) => {
      console.log(`   ${index + 1}. ${cred.name} - ${cred.email} - ${cred.password}`);
    });
    console.log(`   ... y ${credentials.length - 10} usuarios más (ver credentials2.txt)`);

    console.log(`\n👤 Usuarios del sistema:`);
    console.log(`   - admin@regateos.comV$$`);
    console.log(`   - joel.edu.v@gmail.com - 12345678`);
  } catch (error) {
    console.error('❌ Error durante la inicialización masiva:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDatabase2()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}
