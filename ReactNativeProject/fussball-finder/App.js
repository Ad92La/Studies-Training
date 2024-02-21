import { useEffect } from "react";
import AppNavigation from "./Navigation/NavigationContainer";
import { fetchAllFields } from "./utils/fieldApiUtil";
import { FootballFieldsProvider } from './utils/FootballFieldsContext';



function App() {
  useEffect(() => {
    async function getData() {
      const data = await fetchAllFields();
    }
    getData();
  }, []);
  return (
    <FootballFieldsProvider>
      <AppNavigation/>
    </FootballFieldsProvider>
      
  )}

  
export default App;





