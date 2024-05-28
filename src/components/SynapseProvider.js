import { LightNodeProvider } from "@bpx-chain/synapse-react";
import { singleShardInfosToShardInfo, singleShardInfoToPubsubTopic } from '@bpx-chain/synapse-utils';
import { Protocols } from "@bpx-chain/synapse-sdk";

const singleShardInfo = {
    clusterId: 279,
    shard: 0
};

const shardInfo = singleShardInfosToShardInfo([singleShardInfo]);
const pubSubTopic = singleShardInfoToPubsubTopic(singleShardInfo);

const options = {
  bootstrapPeers: [
    '/dns4/synapse1.mainnet.bpxchain.cc/tcp/8000/wss/p2p/16Uiu2HAm55qUe3BFd2fA6UE6uWb38ByEck1KdfJ271S3ULSqa2iu'
  ],
  shardInfo: shardInfo
};

function SynapseProvider(props) {
  return (
    <LightNodeProvider options={options} protocols={[Protocols.Store, Protocols.Filter, Protocols.LightPush]}>
      {props.children}
    </LightNodeProvider>
  );
}

export default SynapseProvider;
export { shardInfo, pubSubTopic };
