import React from "react";

export const Error = props => {
    React.useEffect(() => {
        console.log(props.errors);
    }, [props])
    return (
        <>
            {props.errors !== ''  ? 
            <div className="alert alert-danger fade show form-error" role="alert">
                <ul className="error-ul">
                    {Object.keys(props.errors).map((err, index) => (
                        <li key={index}>{props.errors[err][0]}</li>
                    ))}
                </ul>
            </div> : '' }
        </>
    )
}
