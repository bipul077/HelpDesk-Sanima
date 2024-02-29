import React, { useEffect, useCallback } from "react";

const CentralLogin = (props) => {

    const saveToken = useCallback(() => {
        try{
            const URLParams = new URLSearchParams(props.location.search)
            const token = URLParams.get("token")
            const redirect_url = URLParams.get("redirect_url")

            localStorage.setItem('token', token)

            if(redirect_url !== null){
                props.history.push('/'+ redirect_url);
            }else{
                props.history.push('/dashboard');
            }
        }catch(error){
            props.history.push("/dashboard");
        }
    }, [props]);

    useEffect(() => {
        saveToken()
    }, [saveToken])

    return (
        <>
        </>
    )

}

export default CentralLogin