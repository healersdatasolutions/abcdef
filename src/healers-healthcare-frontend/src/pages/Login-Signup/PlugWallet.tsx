declare global {
    interface Window {
        ic?: {
            plug: {
                principalId: string;
                accountId: string;
                createActor: (options: { canisterId: string; interfaceFactory: any }) => Promise<any>;
                // Add other methods and properties from window.ic.plug that you use in your project
            };
        };
    }
}
import React, { useState } from 'react';
import { healers_healthcare_backend, canisterId as healthcareCanisterId } from '../../../../declarations/healers-healthcare-backend';
import PlugConnect from '@psychedelic/plug-connect';

// Define the component
const ConnectBtn = () => {
    // State management
    const [isConnected, setIsConnected] = useState(false);
    const [principal, setPrincipal] = useState('');
    const [accountId, setAccountId] = useState('');
    const [actor, setActor] = useState(null);

    const whitelist = ['bkyz2-fmaaa-aaaaa-qaaaq-cai'];

    /*const handleDisconnect = () => {
        setIsConnected(false);
        setPrincipal('');
        setAccountId('');
        setActor(null);
    };
*/
    return (
        
<div>
        <PlugConnect
            dark={true}
            title={isConnected ? `Connected as ${principal.substr(0, 5)}-xxxxx-${principal.substr(principal.length - 9, 9)}` : "Connect to Plug"}
            whitelist={whitelist}
            onConnectCallback={async () => {
                if (window.ic?.plug) {
                    setIsConnected(true);
                    setPrincipal(window.ic.plug.principalId);
                    setAccountId(window.ic.plug.accountId);

                    // Directly use the imported backend canister
                    const actorInstance = healers_healthcare_backend;
                    setActor(actor);
                } else {
                    console.error('Plug is not available');
                }
            }}
        />
       {/* {isConnected && (
            <button className="disconnect-btn" onClick={handleDisconnect}>Disconnect</button>
       )}   */}
        </div>
    );
};

export default ConnectBtn;
