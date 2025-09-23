import * as fs from 'fs';
import * as path from 'path';

import { PrismaClient } from '@prisma/client';
import { auth } from '../auth/auth.config';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Datos aleatorios para generar contenido (sin tildes)
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
];

const ciudades = ['Guayaquil', 'Duran', 'Samborondon', 'Nobol', 'Milagro', 'Yaguachi'];

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
];
const productosEjemplo = [
  { name: 'Smartphone Samsung Galaxy', description: 'Telefono inteligente de ultima generacion con camara profesional' },
  { name: 'Laptop HP Pavilion', description: 'Computadora portatil ideal para trabajo y entretenimiento' },
  { name: 'Refrigerador LG', description: 'Refrigerador de 350L con tecnologia inverter' },
  { name: 'Zapatillas Nike Air Max', description: 'Zapatillas deportivas comodas y duraderas' },
  { name: 'Camisa Polo', description: 'Camisa de algodon premium para ocasiones especiales' },
  { name: 'Aceite de Oliva Extra Virgen', description: 'Aceite de oliva de primera calidad, 500ml' },
  { name: 'Champu Pantene Pro-V', description: 'Champu reparador para cabello danado, 400ml' },
  { name: 'Sofa 3 Plazas', description: 'Sofa moderno y comodo para sala de estar' },
  { name: 'Pelota de Futbol', description: 'Pelota oficial para futbol, tamano 5' },
  { name: 'Libro "El Quijote"', description: 'Edicion especial de la obra maestra de Cervantes' },
  { name: 'Muneca Barbie', description: 'Muneca Barbie con vestidos de moda' },
  { name: 'Neumatico Michelin', description: 'Neumatico de alta calidad para automovil' },
  { name: 'Tablet iPad Air', description: 'Tablet Apple con pantalla retina de 10.9 pulgadas' },
  { name: 'Pantalon Jeans', description: 'Jeans clasicos de mezclilla azul' },
  { name: 'Cafe en Grano', description: 'Cafe premium tostado, paquete de 1kg' },
  { name: 'Crema Facial', description: 'Crema hidratante para piel sensible' },
  { name: 'Mesa de Comedor', description: 'Mesa de madera maciza para comedor familiar' },
  { name: 'Raqueta de Tenis', description: 'Raqueta profesional para tenis' },
  { name: 'Monitor Samsung 24"', description: 'Monitor LED full HD para computadora' },
  { name: 'Vestido de Noche', description: 'Vestido largo para ocasiones especiales' },
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRandomEmail(name: string): string {
  const domains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
  // Remover tildes y caracteres especiales
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
  const randomNum = Math.floor(Math.random() * 1000);
  const domain = getRandomElement(domains);
  return `${namePart}${randomNum}@${domain}`;
}

function generateRandomPhone(): string {
  const prefixes = ['+34', '+1', '+52', '+39', '+33'];
  const prefix = getRandomElement(prefixes);
  const number = Math.floor(Math.random() * 900000000) + 100000000;
  return `${prefix}${number}`;
}

function generateRandomPrice(min: number = 10, max: number = 500): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function generateRandomDiscount(): { percent?: number; fixed?: number } {
  const hasDiscount = Math.random() > 0.6; // 40% de probabilidad de tener descuento

  if (!hasDiscount) return {};

  const discountType = Math.random() > 0.5;

  if (discountType) {
    // Descuento porcentual
    return { percent: Math.floor(Math.random() * 30) + 5 }; // 5% a 35%
  } else {
    // Descuento fijo
    return { fixed: generateRandomPrice(5, 50) };
  }
}

async function createUserWithData(userIndex: number, credentials: Array<{ email: string; password: string; name: string }>) {
  const nombre = nombres[userIndex];
  const email = generateRandomEmail(nombre);
  const telefono = '+593978701575';
  const ciudad = getRandomElement(ciudades);
  const nombreNegocio = nombresNegocios[userIndex];
  const password = '12345678';

  console.log(`Creando usuario ${userIndex + 1}: ${nombre} - ${email}`);

  try {
    // Crear usuario usando Better Auth (solo datos básicos)
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
        verified: Math.random() > 0.3, // 70% verificados
        businessName: nombreNegocio,
        businessAddress: `${getRandomElement(['Calle', 'Avenida', 'Plaza'])} ${Math.floor(Math.random() * 100) + 1}, ${ciudad}`,
        nationalId: `${Math.floor(Math.random() * 90000000) + 10000000}`,
        city: ciudad,
        phone: telefono,
        businessLogoId,
        nationalIdImageId,
        storeFrontImageId,
      },
    });

    // Crear categorías para el usuario (2-4 categorías por usuario)
    const numCategorias = Math.floor(Math.random() * 3) + 2;
    const categoriasSeleccionadas = getRandomElements(categoriasProductos, numCategorias);

    const categorias: any[] = [];
    for (let i = 0; i < categoriasSeleccionadas.length; i++) {
      const categoriaData = categoriasSeleccionadas[i];
      // Generar nombre único agregando el ID del merchant y un índice
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

    // Crear productos para el usuario (5-10 productos)
    const numProductos = Math.floor(Math.random() * 6) + 5; // 5 a 10 productos
    const productosSeleccionados = getRandomElements(productosEjemplo, numProductos);

    for (let i = 0; i < numProductos; i++) {
      const productoData = productosSeleccionados[i];
      const categoria = getRandomElement(categorias);
      const precio = generateRandomPrice();
      const descuento = generateRandomDiscount();

      // Crear producto
      const producto = await prisma.product.create({
        data: {
          id: uuidv4(),
          name: productoData.name,
          price: precio,
          description: productoData.description,
          categoryId: categoria.id,
          merchantId: merchant.id,
          discountPercent: descuento.percent || null,
          discountFixed: descuento.fixed || null,
          status: Math.random() > 0.1 ? 'active' : 'inactive', // 90% activos
        },
      });

      // Crear 1-3 imágenes por producto
      const numImagenes = Math.floor(Math.random() * 3) + 1;
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

export async function seedDatabase() {
  console.log('🌱 Iniciando proceso de inicialización de la base de datos...');

  // Array para almacenar credenciales
  const credentials: Array<{ email: string; password: string; name: string }> = [];

  try {
    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await prisma.file.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log('👥 Creando 5 usuarios con datos aleatorios...');

    // Crear 5 usuarios
    for (let i = 0; i < 5; i++) {
      await createUserWithData(i, credentials);
    }

    // Guardar credenciales en archivo de texto
    const credentialsPath = path.join(process.cwd(), 'credentials.txt');
    const credentialsContent = credentials
      .map((cred, index) => `Usuario ${index + 1}:\n` + `  Nombre: ${cred.name}\n` + `  Email: ${cred.email}\n` + `  Contraseña: ${cred.password}\n`)
      .join('\n');

    fs.writeFileSync(credentialsPath, credentialsContent, 'utf8');
    console.log(`📝 Credenciales guardadas en: ${credentialsPath}`);

    // Obtener estadísticas finales
    const userCount = await prisma.user.count();
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();
    const fileCount = await prisma.file.count();

    console.log('🎉 ¡Inicialización completada exitosamente!');
    console.log(`📊 Estadísticas:`);
    console.log(`   - Usuarios: ${userCount}`);
    console.log(`   - Categorías: ${categoryCount}`);
    console.log(`   - Productos: ${productCount}`);
    console.log(`   - Archivos: ${fileCount}`);
    console.log(`\n🔑 Credenciales de acceso:`);
    credentials.forEach((cred, index) => {
      console.log(`   ${index + 1}. ${cred.name} - ${cred.email} - ${cred.password}`);
    });
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}
