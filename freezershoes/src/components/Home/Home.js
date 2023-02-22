import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css"

export const Home = () => {

    const navigate = useNavigate();

    return (
        <>
            <div className="welcome-container">
                <img src={require("./nike-logo-hd.gif")} alt='welcome-img' className="welcome-img"/>
            </div>
            <h1>Freezer Shoes</h1>
            <p>
                Aliquet pede ac iaculis parturient ac curabitur libero integer. Nunc integer vestibulum. Tellus lobortis suscipit venenatis erat sodales penatibus tristique lacus iaculis pretium montes leo accumsan purus, rhoncus morbi habitasse eget. Quis lacinia tempus tincidunt sit massa cras id, ipsum. Congue. Tempus commodo praesent urna vitae risus. Magna bibendum condimentum. Auctor elementum augue at, accumsan ullamcorper cursus litora aenean nibh ultrices montes, neque feugiat sodales convallis. Ornare conubia tincidunt diam tortor eleifend euismod platea felis justo convallis porttitor elit blandit taciti enim euismod Malesuada tellus dictum et penatibus ultricies nisl taciti taciti risus eleifend pulvinar. Viverra habitasse. Suspendisse accumsan tempor ac taciti est, ligula dui iaculis. Torquent et ornare, phasellus torquent praesent aliquam ullamcorper taciti Enim. Accumsan magnis habitant. Vivamus nulla. Dignissim enim per eget morbi pretium torquent placerat duis phasellus elit mollis lacinia justo dolor taciti facilisis vivamus morbi praesent feugiat augue. Parturient maecenas lorem.

                Venenatis lorem rhoncus dignissim felis nunc sem orci per dignissim curae; velit urna convallis feugiat gravida arcu. Vivamus interdum nulla conubia vehicula iaculis donec. Donec tempus sagittis. Magna, netus risus inceptos lectus. Semper ipsum felis porta nullam praesent. Ridiculus class tincidunt nulla semper mauris hac mollis, commodo hendrerit convallis. Tristique neque commodo metus luctus. Felis libero dis diam consectetuer felis, viverra, at tortor volutpat, duis donec a ligula consequat natoque blandit curabitur cubilia consectetuer adipiscing amet, consequat curae; a. Vitae eleifend ultricies. Dolor sollicitudin. Nostra tincidunt odio, sollicitudin justo condimentum semper orci dolor eros laoreet pellentesque tortor congue odio enim metus suspendisse. Nascetur lacinia ullamcorper inceptos ornare. Vehicula, litora pretium laoreet phasellus blandit sapien tellus mauris pretium arcu.

                Hac posuere pharetra cursus inceptos suspendisse varius libero inceptos magna inceptos imperdiet congue sit netus auctor dui morbi varius tellus montes primis vulputate fusce lectus venenatis ullamcorper, rhoncus ornare platea gravida dis mattis aenean curae; justo senectus fusce mattis vestibulum dolor per cras ullamcorper elementum Pharetra feugiat auctor, porta, dui Velit felis euismod habitant eros hac inceptos volutpat sociosqu class. Nonummy felis nascetur gravida sem cum non ante egestas porttitor magnis fusce vehicula aliquam tincidunt nisi gravida egestas ridiculus. Libero turpis nunc aenean leo neque lectus feugiat luctus consequat porttitor vehicula auctor posuere, pretium. Malesuada etiam sociosqu proin. Quam Mus. Interdum nunc condimentum bibendum, blandit. Lacus sodales ridiculus sociosqu phasellus amet gravida, interdum duis nibh nullam convallis suspendisse aptent curae;. Fames arcu nisi sit euismod dolor Aliquet rhoncus sapien euismod sodales curabitur. Ultrices vehicula facilisi turpis.
            </p>
        </>
    )
}
