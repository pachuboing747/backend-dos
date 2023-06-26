const fs = require('fs/promises');
const path = require ("path")

class ProductManager {
  constructor(path) {
    this.filePath = path
 
  }

  async addProduct(prod) {
    const products = await fs.readFile(this.filePath, "utf8")
    const  item = JSON.parse(products)

    const newItem  = item [item.length - 1 ]?.id || 0


    item.push({
        ...prod,
        id: newItem +1
    })

    await fs.writeFile(this.filePath, JSON.stringify(item, null, 2)) 
    
}
    async getProducts(){
        const products = await fs.readFile(this.filePath, "utf8")
        const  item = JSON.parse(products)

        return item

    }

    async getProductById(id) {
        const products = await fs.readFile(this.filePath, 'utf8');
        const item = JSON.parse(products);
    
        const product = item.find((p) => p.id === id);
    
        return product;
    }

    async updateProduct(id, updatedFields) {
        const products = await fs.readFile(this.filePath, 'utf8');
        const item = JSON.parse(products);
    
        const indiceProducto = item.findIndex((p) => p.id === id);
    
        if (indiceProducto !== -1) {
          item[indiceProducto] = {
            ...item[indiceProducto],
            ...updatedFields,
            id: item[indiceProducto].id,
          };
    
          await fs.writeFile(this.filePath, JSON.stringify(item, null, 2));
          return true;
        }
    
        return false;
    }
    async deleteProduct(id) {
        const products = await fs.readFile(this.filePath, 'utf8');
        const item = JSON.parse(products);
    
        const updatedItems = item.filter((p) => p.id !== id);
    
        await fs.writeFile(this.filePath, JSON.stringify(updatedItems, null, 2));
      }
}

const manager = new ProductManager(path.join(__dirname,"productos.json"))

async function main(){
    await manager.addProduct({
        title: "Botines de futbol COPA 20.3",
        description: "Cálzate la adidas Copa 20.3 y deslumbra sobre terrenos de césped natural seco.",
        price: 15000,
        thumbnail: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/3df66ac4860b4c36892cab3000fc2cb5_9366/Botines_de_futbol_Copa_20.3_cesped_natural_seco_Blanco_EF1913_01_standard.jpg",
        code: "C001",
        stock: 10
    })

    console.log(await manager.getProducts())
  
    const actualizarProd = await manager.updateProduct(1, {
      title: 'Nuevo título',
      price: 20000,
    });
  
    if (actualizarProd ) {
      console.log('Producto actualizado exitosamente.');
    } else {
      console.log('Producto no encontrado.');
    }
  
    console.log(await manager.getProductById(1));

    await manager.deleteProduct(2);
    console.log('Producto eliminado exitosamente');
}



main()

