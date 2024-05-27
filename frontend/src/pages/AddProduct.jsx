import React from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import addProduct from "../assets/images/addProduct.jpg";

const AddProduct = () => {
  return (
    <div className="px-10 py-8">
      <div className="bold text-[2.5rem] font-ubuntu ">Add Products</div>
      <hr className="border-[1px] border-y-zinc-500 mb-5" />
      <div className="flex flex-row">
        <div className="flex-1">
            <form>
            <div className="mb-3">
            <label for="productTitle">Product Title</label>
            <br />
            <input
                id="productTitle"
                name="productTitle"
                type="text"
                className="w-[90%] border-2 border-zinc-500 py-1 px-2"
            ></input>
            </div>

            <div className="w-[90%] flex flex-row justify-between mb-3">
                <div>
                    <label for="price">Price</label>
                    <input
                        id="price"
                        name="price"
                        type="number"
                        className="border-2 border-zinc-500 m-2 py-1 px-2"
                    ></input>
                </div>
                <div>
                    <label for="discount">Discount</label>
                    <input
                        id="discount"
                        name="discount"
                        type="number"
                        className="border-2 border-zinc-500 m-2 py-1 px-2"
                    ></input>
                </div>
            </div>

            <div>
            <label for="aboutItem">About this item </label>
            <AddCircleOutlineIcon className="cursor-pointer"/>
            <br />
            <input
                id="aboutItem"
                name="aboutItem"
                type="text"
                className="w-[90%] border-2 border-zinc-500"
            ></input>
            </div>

            <div className="mb-3">
            <label for="description">Description</label>
            <br />
            <textarea
                id="description"
                name="description"
                type="text"
                rows={5}
                cols={80}
                className="w-[90%] border-2 border-zinc-500 py-1 px-2"
            ></textarea>
            </div>
            <div className="mb-3">
            <label for="addImage">Add Images </label>
            <AddCircleOutlineIcon className="cursor-pointer"/>
            <br />
            <input
                id="addImage"
                name="addImage"
                type="file"
                multiple
                className="cursor-pointer"
            ></input>
            </div>
            <input type="submit" className="px-4 py-2 rounded-md bg-green-500"/>
        </form>
        </div>
        <div className="flex-1">
            <img src={addProduct}></img>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
