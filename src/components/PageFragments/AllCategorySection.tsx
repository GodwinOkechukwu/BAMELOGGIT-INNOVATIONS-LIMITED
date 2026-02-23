"use client";
import React, { useEffect, useRef, useState } from "react";

import Picture from "../picture/Picture";
import { useCategories, WooCommerce } from "../lib/woocommerce";
import ProductCard from "../Cards/ProductCard";
import HomeCard from "../Cards/HomeCard";
import Carousel from "../Reusables/Carousel";
import Link from "next/link";
import { convertToSlug, convertToSlug2 } from "@constants";
import { useEncryptionHelper } from "../EncryptedData";
import { useDispatch } from "react-redux";
import { updateCategorySlugId } from "../config/features/subCategoryId";
import { useRouter } from "next/navigation";
import { heroBg, heroImage, heroImage2, heroImage3 } from "@public/images";
import HeroCarousel from "../Cards/HeroCarousel";
import img1 from "../../../public/images/image1.png";
import img2 from "../../../public/images/image2.png";
import img3 from "../../../public/images/image3.png";
import img4 from "../../../public/images/image4.png";
import img5 from "../../../public/images/image5.png";
import { FaArrowRight } from "@node_modules/react-icons/fa";
const AllCategorySection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [maxScrollTotal, setMaxScrollTotal] = useState(0);
  const [scrollLeftTotal, setScrollLeftTotal] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const router = useRouter();

  // State to hold products by category
  const [categoryProductsMap, setCategoryProductsMap] = useState<{
    [key: string]: ProductType[];
  }>({});
  // WooCommerce API Category
  const {
    data: categories,
    isLoading: categoryWpIsLoading,
    isError: categoryIsError,
  } = useCategories("");

  const Categories: CategoryType[] = categories;
  const TotalCatgory = Categories?.length - 1;

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setIsLoading(true);

        const filteredCategories = categories
          ?.filter((category: CategoryType) => category?.count > 0)
          ?.slice(0, 5);

        if (filteredCategories) {
          const productsPromises = filteredCategories.map(
            async (category: CategoryType) => {
              const response = await WooCommerce.get(
                `products?category=${category?.id}`,
              );

              // Check if there is at least one product in the category
              const firstProductImage =
                response?.data.length > 0
                  ? response?.data[0]?.images[0]?.src
                  : null;

              return {
                categoryId: category?.id,
                firstProductImage: firstProductImage, // Store the first product's image
              };
            },
          );

          const productsResults = await Promise.all(productsPromises);

          // Update the state with the first product images mapped by category
          const productsMap = productsResults.reduce(
            (acc: any, result: any) => ({
              ...acc,
              [result.categoryId]: result.firstProductImage,
            }),
            {},
          );

          setCategoryProductsMap(productsMap);
        }
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categories?.length) {
      fetchCategoryProducts();
    }
  }, [categories]);

  const handleNext = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;
      setScrollLeftTotal(scrollLeft);
      setMaxScrollTotal(maxScroll);

      sliderRef.current.scrollLeft += 600; // Adjust the scroll distance as needed
      setCurrentIndex((prevIndex) =>
        prevIndex < TotalCatgory - 1 ? prevIndex + 1 : prevIndex,
      );
    }
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;
      setScrollLeftTotal(scrollLeft);
      setMaxScrollTotal(maxScroll);
      // console.log(scrollLeft);
      if (scrollLeft > 0) {
        sliderRef.current.scrollLeft -= 600; // Adjust the scroll distance as needed
        setCurrentIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
        );
      }
    }
  };

  return (
    <>
      {/* Hero Concept inspired by the image */}
      <div className="relative w-full overflow-hidden">
        <div className=" mt-[100px] md:mt-[200px] px-8  w-full space-y-6">
          <article className="w-[80%] pt-10 md:max-w-[800px] m-auto text-center mb-40 ">
            <h1 className="text-[#0C0B15] text-3xl md:text-6xl font-bold">
              Sophisticated Accessories <br /> For Your Computer
            </h1>
            <div className="w-[60%] mt-10 m-auto">
              <p className="text-[#4B496A]">
                Elegant Designs, Exceptional Results,
                <br />
                Elevating Your Computer Experience.
              </p>
            </div>
            <button className="border flex gap-3 m-auto items-center hover:opacity-[0.8] text-[#fff] border-[#A9BE66] w-fit bg-[#A9BE66] rounded-3xl px-4 py-3 my-[30px]">
              Get Started <FaArrowRight />
            </button>
          </article>
          <div className="flex flex-col gap-5 md:flex-row mt-20 w-full">
            <Picture
              className="md:h-[550px] relative md:w-[727px]"
              src={img2}
              alt="img1"
            />
            <Picture
              className="md:h-[550px] md:w-[727px] relative md:bottom-[100px] md:right-[100px]"
              src={img1}
              alt="img2"
            />
          </div>
        </div>
      </div>
      {/* Category Section Styling Idea */}
      <div className=" w-full mt-[100px]">
        {/* {Categories?.slice(0, 5).map((cat) => {
          const productImage: any = categoryProductsMap[cat?.id];
          return (
            <Link
              key={cat.id}
              href={`/category/${convertToSlug(cat.name)}-${cat.id}`}
              className="group relative h-48 bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all"
            >
              <Picture
                src={cat.image?.src ?? productImage}
                alt={cat.image?.name}
                className="w-full h-full object-contain opacity-60 group-hover:scale-110 transition-transform duration-700"
              />

              <div className="absolute bottom-4 left-4">
                <h3 className="text-lg font-bold text-white uppercase">
                  {cat.name}
                </h3>
              </div>
            </Link>
          );
        })} */}
        <article className="text-center w-[60%] m-auto">
          <h1 className="text-3xl md:text-5xl fomt-bold">Our Services </h1>
          <div className="md:w-[60%] m-auto pt-7">
            <p>
              We offer bespoke interior design solutions tailored to your
              needs,ensuring every space is both beautiful and functional.
            </p>
          </div>
        </article>

        <div className="flex flex-col  gap-5 md:flex-row  md:justify-between px-8 mt-10 w-full justify-end">
          <div className="m-auto w-[95%] md:w-[388px] pb-5 border border-[#D4D2E3] rounded-2xl">
            <Picture className="w-full h-[338px]" src={img5} alt="img5" />
            <article className="w-[90%] m-auto mt-5">
              <p>
                Discover our curated collection of Accessories designed to blend
                comfort with exquisite experience. Each piece is crafted with
                meticulous attention to detail, ensuring both functionality and
                aesthetic appeal in your space.
              </p>
            </article>
          </div>

          <div className=" m-auto w-[95%] md:w-[388px] pb-5 border border-[#D4D2E3] rounded-2xl">
            <Picture className=" h-[338px]" src={img4} alt="img4" />
            <article className="w-[90%] m-auto mt-5">
              <p>
                Discover our curated collection of Accessories designed to blend
                comfort with exquisite experience. Each piece is crafted with
                meticulous attention to detail, ensuring both functionality and
                aesthetic appeal in your space.
              </p>
            </article>
          </div>

          <div className="w-[95%] m-auto md:w-[388px] pb-5 border border-[#D4D2E3] rounded-2xl">
            <Picture className=" h-[338px]" src={img3} alt="img3" />
            <article className="w-[90%] m-auto mt-5">
              <p>
                Discover our curated collection of Accessories designed to blend
                comfort with exquisite experience. Each piece is crafted with
                meticulous attention to detail, ensuring both functionality and
                aesthetic appeal in your space.
              </p>
            </article>
          </div>
        </div>
      </div>

      {/* </Carousel> */}
    </>
  );
};

export default AllCategorySection;
