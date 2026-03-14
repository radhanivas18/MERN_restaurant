import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CardFeature from "./CardFeature";
import FilterProduct from "./FilterProduct";

const AllProduct = ({ heading }) => {
  const productData = useSelector((state) => state.product.productList);
  const categoryList = [...new Set(productData.map((el) => el.category))];

  //filter data display
  const [filterby, setFilterBy] = useState("");
  const [dataFilter, setDataFilter] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setDataFilter(productData);
  }, [productData]);

  const handleFilterProduct = (category) => {
    if (filterby.toLowerCase() === category.toLowerCase()) {
      setFilterBy("");
      setDataFilter(productData);
      return;
    }
    setFilterBy(category);
    const filter = productData.filter(
      (el) => el.category.toLowerCase() === category.toLowerCase()
    );
    setDataFilter(filter);
    setSearch(""); // Clear search when filtering by category
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (!value) {
      setDataFilter(productData);
      return;
    }
    const filter = productData.filter(el => 
      el.name.toLowerCase().includes(value.toLowerCase()) || 
      el.category.toLowerCase().includes(value.toLowerCase())
    );
    setDataFilter(filter);
    setFilterBy(""); // Clear category filter when searching
  }

  const loadingArrayFeature = new Array(10).fill(null);

  return (
    <div className="my-5" id="allproduct">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="font-bold text-2xl text-slate-800">{heading}</h2>
        <div className="w-full max-w-sm">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full p-2 border border-slate-300 rounded-md focus:outline-red-500 shadow-sm"
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="flex gap-4 justify-center overflow-scroll scrollbar-none">
        {categoryList[0] ? (
          categoryList.map((el) => {
            return (
              <FilterProduct
                category={el}
                key={el}
                isActive={el.toLowerCase() === filterby.toLowerCase()}
                onClick={() => handleFilterProduct(el)}
              />
            );
          })
        ) : (
          <div className="min-h-[150px] flex justify-center items-center">
            <p>Loading...</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 my-4">
        {dataFilter[0]
          ? dataFilter.map((el) => {
              return (
                <CardFeature
                  key={el._id}
                  id={el._id}
                  image={el.image}
                  name={el.name}
                  category={el.category}
                  price={el.price}
                />
              );
            })
          : loadingArrayFeature.map((el, index) => (
              <CardFeature loading="Loading..." key={index + "allProduct"} />
            ))}
      </div>
    </div>
  );
};

export default AllProduct;
