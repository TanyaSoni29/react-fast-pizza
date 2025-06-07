import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "./MenuItem";

function Menu() {
  const menu = useLoaderData(); // custom hook to access data from loader function which is provided to the route 
  console.log(menu)
  return <ul>
    {menu.map(pizza => <MenuItem pizza={pizza} key={pizza.id} />)}
  </ul>;
}

export async function loader() {
const menu = await getMenu();
return menu;
} // this function will fetch the data of the menu 

export default Menu;
