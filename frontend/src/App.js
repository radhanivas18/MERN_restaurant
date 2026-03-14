import "./App.css";
import Header from "./component/Header";
import { Outlet } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDataProduct } from "./redux/productSlide";
import Footer from "./component/Footer";

function App() {
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.product);

  useEffect(() => {
    (async () => {
      const serverDomin = process.env.REACT_APP_SERVER_DOMIN || "http://localhost:8080";
      const url = `${serverDomin}/product`;
      console.log("Fetching products from:", url);
      try {
        const res = await fetch(url);
        if (!res.ok) {
           throw new Error(`HTTP error! status: ${res.status}`);
        }
        const resData = await res.json();
        console.log("Fetched products success:", resData.length);
        dispatch(setDataProduct(resData));
      } catch (err) {
        console.error("Fetch products failed:", err);
        toast.error("Failed to connect to server. Ensure backend is running.");
      }
    })();
  }, [dispatch]);
  //  console.log(productData); // {productList: Array(0), cartItem: Array(0)}
  return (
    <>
      <Toaster />
      <div>
        <Header />
        <main className="pt-16 bg-slate-100 min-h-[calc(100vh)]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
