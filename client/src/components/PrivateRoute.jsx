import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  const { currentUser } = useSelector((state => state.user))
  // If current user: render child elements(profile page), otherwise navigate to sign in page
  return (currentUser ? <Outlet/> : <Navigate to='/sign-in'/>); 
}
