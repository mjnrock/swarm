/* eslint-disable */
import React from "react";
import { useNodeContext } from "@lespantsfancy/hive/lib/react";
import { Segment } from "semantic-ui-react";

import { Context } from "../App";

export default function Home(props) {
    const { node: game } = useNodeContext(Context);

    return (
        <Segment>
            
        </Segment>
    )
}