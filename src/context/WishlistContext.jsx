import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {

  const [wishlist, setWishlist] = useState(() => {

    const savedWishlist =
      localStorage.getItem("wishlist");

    return savedWishlist
      ? JSON.parse(savedWishlist)
      : [];
  });


  // Save wishlist whenever it changes
  useEffect(() => {

    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishlist)
    );

  }, [wishlist]);


  // Add destination
  function addToWishlist(destination) {

    setWishlist((currentWishlist) => {

      // Don't add duplicate
      const alreadyExists =
        currentWishlist.some(
          (item) =>
            item.id === destination.id
        );

      if (alreadyExists) {
        return currentWishlist;
      }

      return [
        ...currentWishlist,
        destination
      ];
    });
  }


  // Remove destination
  function removeFromWishlist(id) {

    setWishlist((currentWishlist) =>
      currentWishlist.filter(
        (item) => item.id !== id
      )
    );
  }


  // Check whether destination is saved
  function isInWishlist(id) {

    return wishlist.some(
      (item) => item.id === id
    );
  }


  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}


export function useWishlist() {

  return useContext(WishlistContext);

}