import { isExpired } from "react-jwt";

export const IsLoggedIn = () => {
	const token = localStorage.getItem('token');
	if(token !== null){
		try{
  			const isMyTokenExpired = isExpired(token);
			  
			// Check if token expiry
			if(!isMyTokenExpired){
				return true;
			} else{
				localStorage.clear();
				return false;
			}
		} catch(error) {
			localStorage.clear();
			return false;
		}
		
	} else{
		localStorage.clear();
		return false;
	}  	
}
