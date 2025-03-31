import express from 'express';
import { addProduct, deleteProduct, getProducts, updateProduct, getProduct} from "../controller/productController.js";


const productRouter = express.Router();

productRouter.post("/addProduct",addProduct);
productRouter.get("/getProducts",getProducts);
productRouter.get("/:key",getProduct)
productRouter.put("/updateProduct/:key",updateProduct);
productRouter.delete("/deleteProduct/:key",deleteProduct);


export default productRouter;