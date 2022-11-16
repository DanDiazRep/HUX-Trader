import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { useQuery } from "react-query";
import { UserItemsType } from "../screens/home/Home";
import apiClient from "../shared/htttp-common";

export const useUser = () =>{
    const { user, logout } = useAuth0();
    const [userData, setUserData] = React.useState<UserItemsType>();
    const [selectedItem, setSelectedItem] = React.useState<string>("");
    const [isProductsActive, setProductsActive] = React.useState<boolean>(true);
    const [isNotAddingProduct, setNotAddingProduct] = React.useState<boolean>(true);
    const [isNotEditingProduct, setNotEditingProduct] = React.useState<boolean>(true);
    
    const { isLoading: isLoadingUser, refetch: getUserById} = useQuery(
      "query_user_by_id",
      async () => {
        if(user){
          return await apiClient.get(`/user/${user.sub}`);
        }
      },
      {
        enabled: false,
        retry: 1,
        onSuccess: (res) => {
          if (res) {
            console.log(res)
            setUserData(res.data);
            if(res.data.items?.length > 0){
              setSelectedItem(res.data.items[0].id)
            }
          }
        },
        onError: (err) => {
          console.log("ERROR",err);
          if(user && user.sub && user.email){
            setUserData({
              id: '',
              userId: user.sub,
              email: user.email,
              items: []
            })
          }
        },
      }
    );
}