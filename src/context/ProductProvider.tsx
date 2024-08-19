import { createContext, ReactElement, useState, useEffect } from "react"


export type ProductType = {
    sku: string,
    name: string,
    price: number,
}

const initState: ProductType[] =[]

// const initState: ProductType[] = [
//     {
//         "sku": "item0001",
//         "name": "Widget",
//         "price": 9.99
//     },
//     {
//         "sku": "item0002",
//         "name": "Primium Widget",
//         "price": 19.99
//     },
//     {
//         "sku": "item0003",
//         "name": "Deluxe Widget",
//         "price": 9.99
//     }
// ]


export type UseProductContextType = {
    products: ProductType[]
}

const initContextState: UseProductContextType = {
    products: initState
}

export const ProductContext = createContext<UseProductContextType>(initContextState)

type ChildrenType = {
    children?: ReactElement | ReactElement[]
}

export const ProductProvider = ({
    children
}: ChildrenType ): ReactElement => {
    const [products, setProducts] = useState<ProductType[]>(initState)

    useEffect(()=>{
         const fetchProduct = async ():Promise<void> =>{
            try{
                const res = await fetch('http://localhost:3500/products');
                const data = await res.json();
                // return data
                setProducts(data)
            }catch(err){
                if (err instanceof Error){
                    console.log(err.message)
                }
               
            }
         }
        fetchProduct()
      
         
    }, [])

    return (
       
        <ProductContext.Provider value={{products}}>
            {children}
        </ProductContext.Provider>
    )
}

export default ProductContext