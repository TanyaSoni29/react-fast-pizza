import { Outlet, useNavigation } from 'react-router-dom';
import CartOverview from '../features/cart/CartOverview';
import Header from './Header';
import Loader from './Loader';

export default function AppLayout() {
  const navigation = useNavigation();
  console.log(navigation);
  const isLoading = navigation.state === 'loading';
  return (
    <div className="grid h-screen grid-cols-1 grid-rows-[auto_1fr_auto]">
      {isLoading && <Loader />}
      <Header />
      {/* we want to scroll the main content not overall scroll */}
      <div className="overflow-scroll">
        <main className="mx-auto max-w-3xl">
          <Outlet />
        </main>
      </div>
      <CartOverview />
    </div>
  );
}
