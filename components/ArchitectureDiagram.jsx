

import React from 'react';
import styles from '../styles/architecturediagram.module.css';

class ArchitectureDiagram extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {
    } = this.state;

    return (
      <div className={[styles['architecture-diagram-container']].join(' ')}>
        <div className={[styles['Things']].join(' ')}>
          <div className={[styles['Devices']].join(' ')}>
            <div className={[
                styles['ThingsHeadLeft'],
                styles['diagram-top-level-heading']
              ].join(' ')}>
              <div
                className={styles['diagram-top-level-heading-2wide']}>
                Things
              </div>
            </div>
            <div className={[
                styles['DevicesHead'],
                styles['diagram-column-heading']
              ].join(' ')}>
              Devices
            </div>
            <div className={[styles['DevicesLogos']].join(' ')}></div>
          </div>
          <div className={[styles['Connectivity']].join(' ')}>
            <div className={[styles['ThingsHeadRight'], styles['diagram-top-level-heading']].join(' ')}></div>
            <div className={[
                styles['ConnectivityHead'],
                styles['diagram-column-heading']
              ].join(' ')}>
              Connectivity
            </div>
            <div className={[styles['ConnectivityLogos']].join(' ')}></div>
          </div>
        </div>
        <div className={[styles['Solution']].join(' ')}>
          <div className={[styles['Ingestion']].join(' ')}>
            <div className={[
                styles['SolutionHeadA'],
                styles['diagram-top-level-heading']
              ].join(' ')}>
              <div
                className={styles['diagram-top-level-heading-4wide']}>
                Solution
              </div>
            </div>
            <div className={[
                styles['IngestionHead'],
                styles['diagram-column-heading']
              ].join(' ')}>
              Ingestion
            </div>
            <div className={[
                styles['MessagingHead'],
                styles['subtype-heading']
              ].join(' ')}>
              Messaging
            </div>
            <div className={[styles['MessagingLogos']].join(' ')}></div>
            <div className={[
                styles['ProvisioningHead'],
                styles['subtype-heading']
              ].join(' ')}>
              Provisioning
            </div>
            <div className={[styles['ProvisioningLogos']].join(' ')}></div>
          </div>
          <div className={[styles['UI']].join(' ')}>
            <div className={[styles['SolutionHeadB'], styles['diagram-top-level-heading']].join(' ')}></div>
            <div className={[
                styles['UIHead'],
                styles['diagram-column-heading']
              ].join(' ')}>
              Management
            </div>
            <div className={[
                styles['RealTimeHead'],
                styles['subtype-heading']
              ].join(' ')}>
              Real-Time Dashboard
            </div>
            <div className={[styles['RealTimeLogos']].join(' ')}></div>
            <div className={[
                styles['ManagementHead'],
                styles['subtype-heading']
              ].join(' ')}>
              Device Management
            </div>
            <div className={[styles['ManagementLogos']].join(' ')}></div>
          </div>
          <div className={[styles['HADR']].join(' ')}>
            <div className={[styles['SolutionHeadC'], styles['diagram-top-level-heading']].join(' ')}></div>
            <div className={[
                styles['HADRHead'],
                styles['diagram-column-heading']
              ].join(' ')}>
              Reliability
            </div>
            <div className={[
                styles['ScalingHead'],
                styles['subtype-heading']
              ].join(' ')}>
              Scaling
            </div>
            <div className={[styles['ScalingLogos']].join(' ')}></div>
            <div className={[
                styles['CrossRegionHead'],
                styles['subtype-heading']
              ].join(' ')}>
              Cross-Region Redundancy
            </div>
            <div className={[styles['CrossRegionLogos']].join(' ')}></div>
          </div>
          <div className={[styles['Data']].join(' ')}>
            <div className={[styles['SolutionHeadD'], styles['diagram-top-level-heading']].join(' ')}></div>
            <div className={[
                styles['DataHead'],
                styles['diagram-column-heading']
              ].join(' ')}>
              Data
            </div>
            <div className={[
                styles['HotHead'],
                styles['subtype-heading']
              ].join(' ')}>
              Hot Path
            </div>
            <div className={[styles['HotLogos']].join(' ')}></div>
            <div className={[
                styles['WarmHead'],
                styles['subtype-heading']
              ].join(' ')}>
              Warm Path
            </div>
            <div className={[styles['WarmLogos']].join(' ')}></div>
            <div className={[
                styles['ColdHead'],
                styles['subtype-heading']
              ].join(' ')}>
              Cold Path
            </div>
            <div className={[styles['ColdLogos']].join(' ')}></div>
          </div>
        </div>
        <div className={[styles['Actions']].join(' ')}>
          <div className={[styles['Connections']].join(' ')}>
            <div className={[
                styles['ActionsHeadLeft'],
                styles['diagram-top-level-heading']
              ].join(' ')}>
              <div
                className={styles['diagram-top-level-heading-2wide']}>
                Actions
              </div>
            </div>
            <div className={[
                styles['ConnectionsHead'],
                styles['diagram-column-heading']
              ].join(' ')}>
              Connections
            </div>
            <div className={[styles['ConnectionsLogos']].join(' ')}></div>
          </div>
          <div className={[styles['Integrations']].join(' ')}>
            <div className={[styles['ActionsHeadRight'], styles['diagram-top-level-heading']].join(' ')}></div>
            <div className={[
                styles['IntegrationsHead'],
                styles['diagram-column-heading']
              ].join(' ')}>
              Integrations
            </div>
            <div className={[styles['IntegrationsLogos']].join(' ')}></div>
          </div>
        </div>
      </div>
    );
  }
}

export async function getStaticProps(context) {
  return {
    props: {
    },
  };
};

export default ArchitectureDiagram;
