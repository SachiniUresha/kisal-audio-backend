import express from 'express';
import { addProduct, deleteProduct, getProducts, updateProduct, getProduct, getProductStats} from "../controller/productController.js";


const productRouter = express.Router();

productRouter.get("/stats", getProductStats);
productRouter.post("/addProduct",addProduct);
productRouter.get("/getProducts",getProducts);
productRouter.get("/:key",getProduct)
productRouter.put("/updateProduct/:key",updateProduct);
productRouter.delete("/deleteProduct/:key",deleteProduct);



export default productRouter;