import { YellowStar } from "@/assets/AllSvgs";
import { Product } from "@/types";
import { Badge } from "../ui/badge";
import { EditImg } from "./EditImg";
import { EditPage } from "./EditPage";
import { Preview } from "./Preview";

export default function ProductCard({ ...data }: Product) {
  const color = data.colors;
  const size = data.size;
  const image = data.primaryPicture;
  return (
    <>
      <div className="relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-100 dark:bg-gray-900 shadow-md">
        <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
          <img
            className="w-full h-full object-center object-cover"
            src={image}
            alt="product image"
          />
          {data.discount && (
            <span className="absolute top-0 left-0 m-2 rounded-full bg-sky-500 px-2 text-center text-sm font-medium text-white">
              {data.discount}% OFF
            </span>
          )}
          <span className="absolute top-0 right-0 m-2 bg-black p-1 rounded-md text-center text-sm font-medium text-white hover:bg-gray-400 hover:text-black">
            <EditImg
              images={data.pictureLinks}
              imageNames={data.pictures}
              id={data._id}
              mainImg={data.primaryPicture}
            />
          </span>
        </div>
        <div className="mt-4 px-5 pb-5 text-slate-900 dark:text-slate-100">
          <div className="flex items-center w-full justify-between min-w-0 ">
            <h5 className="text-xl tracking-tight capitalize">{data.name}</h5>
            <div className="flex items-center text-white text-xs ml-3 rounded-lg uppercase">
              {data.stock >= 1 ? (
                <Badge className="bg-green-600">
                  instock: &nbsp; {data.stock}
                </Badge>
              ) : (
                <Badge variant="destructive">out of stock</Badge>
              )}
            </div>
          </div>

          <div className="flex py-4 text-sm justify-between">
            <div className="flex-1 inline-flex items-center mb-3">
              <div className="w-full flex-none flex items-center">
                <ul className="flex flex-row justify-center items-center space-x-2">
                  {color.map((colorName, index) => (
                    <li className="" key={index}>
                      <span
                        className="block p-1 border-2 border-transparent hover:border-blue-600 rounded-full transition ease-in duration-300"
                        style={{
                          borderColor: "transparent", // Default border color
                          transition: "border-color 0.3s ease-in-out",
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.borderColor =
                            colorName)
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.borderColor =
                            "transparent")
                        }
                      >
                        <span
                          className="block w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: colorName,
                          }}
                        ></span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex-1 inline-flex text-gray-500 justify-end items-center mb-3">
              <span className="whitespace-nowrap mr-3">Size:</span>
              <div className="cursor-pointer uppercase">
                {size.map((item, index) => (
                  <span
                    key={index}
                    className="hover:text-purple-500 hover:text-base p-1 py-0"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-2 mb-5 flex items-center justify-between">
            <p>
              <span className="text-3xl font-bold">
                <span className="text-lg">BDT.&nbsp;</span>
                {data.price}
              </span>
              {data.oldPrice && (
                <span className="text-sm line-through">Tk.{data.oldPrice}</span>
              )}
            </p>
            <div className="flex items-center">
              <YellowStar />
              <YellowStar />
              <YellowStar />
              <span className="mr-2 text-black ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">
                5.0
              </span>
            </div>
          </div>
          <div className="flex justify-between py-4 capitalize">
            <Preview {...data} />
            <EditPage {...data} />
          </div>
        </div>
      </div>
    </>
  );
}
