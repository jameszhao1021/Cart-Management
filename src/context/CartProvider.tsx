import { ChangeEvent, useCallback, useReducer, useMemo, createContext, ReactElement } from "react"


export type CartItemType = {
    sku: string,
    name: string,
    price: number,
    qty: number
}

type CartStateType = {
    cart: CartItemType[]
}

const initCartState: CartStateType = {
    cart: []
}

const REDUCER_ACTION_TYPE = {
    ADD: 'ADD',
    REMOVE: 'REMOVE',
    QUANTITY: 'QUANTITY',
    SUBMIT: 'SUBMIT',
}


// const enum REDUCER_ACTION_TYPE  {
//     ADD,
//     REMOVE,
//     QUANTITY,
//     SUBMIT
// }

export type ReducerActionType = typeof REDUCER_ACTION_TYPE

export type ReducerAction = {
    type: keyof ReducerActionType,
    payload?: CartItemType
}

const reducer = (state: CartStateType, action: ReducerAction): CartStateType => {
    switch (action.type) {
        case REDUCER_ACTION_TYPE.ADD:
            if (!action.payload) {
                throw new Error('action.payload missing in add action')
            }
            const { sku, name, price } = action.payload
            const filteredCart: CartItemType[] = state.cart.filter(item => (
                item.sku !== sku
            ))
            const itemExist: CartItemType | undefined = state.cart.find(
                item => item.sku === sku
            )
            const qty: number = itemExist ? itemExist.qty + 1 : 1
            return {
                ...state, cart: [
                    ...filteredCart,
                    { sku, name, price, qty }
                ]
                // ...state, cart: state.cart.find(item=>item.sku === sku)? (state.cart.map(item => item.sku === sku? {...item, qty: item.qty + 1} : item)):[...state.cart, {sku, name, price, qty: 1}]
            }

        case REDUCER_ACTION_TYPE.REMOVE:
            if (!action.payload) {
                throw new Error('action.payload missing in remove action')
            }
            const { sku: removeSku } = action.payload;
            const filteredCartRemove: CartItemType[] = state.cart.filter(item => (
                item.sku !== removeSku
            ))
            // const selectedItem: CartItemType | undefined = state.cart.find(item=>item.sku===removeSku)
            // if(!selectedItem){
            //     throw new Error('there is no selected item')
            // }
            return {
                // ...state, cart: 
                //     selectedItem.qty > 1?
                //     [...filteredCartRemove, {  ...selectedItem, qty: selectedItem.qty - 1}]:
                //     filteredCartRemove
                ...state, cart: [...filteredCartRemove]
            }

        case REDUCER_ACTION_TYPE.QUANTITY:
            if (!action.payload) {
                throw new Error('action.payload missing in quantity action')
            }
            const { sku: skuQuan, qty: qtyQuan } = action.payload

            const itemExistQuan: CartItemType | undefined = state.cart.find(
                item => item.sku === skuQuan
            )
            if (!itemExistQuan) {
                throw new Error('Item must exist in order to update quantity')
            }

            const updatedItem: CartItemType = {
                ...itemExistQuan, qty: qtyQuan
            }

            const filteredCartQuantity: CartItemType[] = state.cart.filter(item => (
                item.sku !== skuQuan
            ))
            return {
                ...state, cart: [
                    ...filteredCartQuantity,
                    updatedItem
                ]
            }
        case REDUCER_ACTION_TYPE.SUBMIT:
            return {
                ...state, cart: []
            }
        default:
            throw new Error('undefined reducer action type')
    }
}

const useCartContext = (initCartState: CartStateType) => {
    const [state, dispatch] = useReducer(reducer, initCartState)

   const REDUCER_ACTIONS = useMemo(()=>{
    return REDUCER_ACTION_TYPE
   }, [])

  const totalItems = state.cart.reduce((previousValue, cartItem) => previousValue + cartItem.qty, 0)

  const totalPrice = new Intl.NumberFormat('en-US', {style:
    'currency', currency:'USD'
  }).format(
    state.cart.reduce((previousValue, cartItem)=>previousValue + cartItem.price * cartItem.qty, 0)
  )
  const cart = state.cart.sort((a,b)=>{
       const itemA = Number(a.sku.slice(-4));
       const itemB = Number(b.sku.slice(-4));
       return itemA - itemB
  })
  return {dispatch, REDUCER_ACTIONS, totalItems, totalPrice, cart}
}

export type UseCartContextType = ReturnType<typeof useCartContext>

const initCartContextState : UseCartContextType ={
    dispatch: ()=>{},
    REDUCER_ACTIONS: REDUCER_ACTION_TYPE,
    totalItems: 0,
    totalPrice: '',
    cart: []
}

export const CartContext = createContext<UseCartContextType>(initCartContextState)

type ChildrenType = {children?: ReactElement | ReactElement[]}

export const CartProvider = ({children}:ChildrenType):ReactElement => {
    return(
        <CartContext.Provider value={useCartContext(initCartState)}>
            {children}
        </CartContext.Provider>
    )
}

export default CartContext