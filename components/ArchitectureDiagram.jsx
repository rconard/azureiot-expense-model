

import React from 'react';
import { ServiceContext } from '../contexts/ServiceContext.js';
import styles from '../styles/architecturediagram.module.css';
import DiagramLogos from './DiagramLogos.jsx';

class ArchitectureDiagram extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {
      enabledServices,
      registry,
    } = this.context;
    const {
    } = this.state;

    if (Object.keys(registry).length < Math.max(enabledServices.length, 1)) {
      return null;
    }

    let architectureCollate = {
      Devices: [],
      Connectivity: [],
      Messaging: [],
      Provisioning: [],
      RealTime: [],
      Management: [],
      Scaling: [],
      CrossRegion: [],
      Hot: [],
      Warm: [],
      Cold: [],
      Connections: [],
      Integrations: [],
    };

    enabledServices.forEach((service) => {
      if ('logos' in registry[service]) {
        Object.keys(architectureCollate).forEach((logoCategory) => {
          if (logoCategory in registry[service].logos) {
            architectureCollate[logoCategory] = _.concat(architectureCollate[logoCategory], registry[service].logos[logoCategory]);
          }
        });
      }
    });

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
            <div
              className={styles['DevicesLogos']}
              style={{
                maxWidth: 100 / Math.max(architectureCollate.Devices.length, 1)
              }} >
              <DiagramLogos
                allowedHeight={520}
                logoArray={architectureCollate.Devices} />
            </div>
          </div>
          <div className={[styles['Connectivity']].join(' ')}>
            <div className={[styles['ThingsHeadRight'], styles['diagram-top-level-heading']].join(' ')}></div>
            <div className={[
                styles['ConnectivityHead'],
                styles['diagram-column-heading']
              ].join(' ')}>
              Connectivity
            </div>
            <div
              className={styles['ConnectivityLogos']}
              style={{
                maxWidth: 100 / Math.max(architectureCollate.Connectivity.length, 1)
              }} >
              <DiagramLogos
                allowedHeight={520}
                logoArray={architectureCollate.Connectivity} />
            </div>
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
            <div className={[styles['MessagingLogos']].join(' ')}>
              <DiagramLogos
                allowedHeight={450}
                logoArray={architectureCollate.Messaging} />
            </div>
            <div className={[
                styles['ProvisioningHead'],
                styles['subtype-heading']
              ].join(' ')}>
              Provisioning
            </div>
            <div className={[styles['ProvisioningLogos']].join(' ')}>
              <DiagramLogos
                allowedHeight={140}
                logoArray={architectureCollate.Provisioning} />
            </div>
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
            <div className={[styles['RealTimeLogos']].join(' ')}>
              <DiagramLogos
                allowedHeight={450}
                logoArray={architectureCollate.RealTime} />
            </div>
            <div className={[
                styles['ManagementHead'],
                styles['subtype-heading']
              ].join(' ')}>
              Device Management
            </div>
            <div className={[styles['ManagementLogos']].join(' ')}>
              <DiagramLogos
                allowedHeight={120}
                logoArray={architectureCollate.Management} />
            </div>
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
            <div className={[styles['ScalingLogos']].join(' ')}>
              <DiagramLogos
                allowedHeight={450}
                logoArray={architectureCollate.Scaling} />
            </div>
            <div className={[
                styles['CrossRegionHead'],
                styles['subtype-heading']
              ].join(' ')}>
              Cross-Region Redundancy
            </div>
            <div className={[styles['CrossRegionLogos']].join(' ')}>
              <DiagramLogos
                allowedHeight={140}
                logoArray={architectureCollate.CrossRegion} />
            </div>
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
            <div className={[styles['HotLogos']].join(' ')}>
              <DiagramLogos
                allowedHeight={140}
                logoArray={architectureCollate.Hot} />
            </div>
            <div className={[
                styles['WarmHead'],
                styles['subtype-heading']
              ].join(' ')}>
              Warm Path
            </div>
            <div className={[styles['WarmLogos']].join(' ')}>
              <DiagramLogos
                allowedHeight={140}
                logoArray={architectureCollate.Warm} />
            </div>
            <div className={[
                styles['ColdHead'],
                styles['subtype-heading']
              ].join(' ')}>
              Cold Path
            </div>
            <div className={[styles['ColdLogos']].join(' ')}>
              <DiagramLogos
                allowedHeight={140}
                logoArray={architectureCollate.Cold} />
            </div>
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
            <div className={[styles['ConnectionsLogos']].join(' ')}>
              <DiagramLogos
                allowedHeight={520}
                logoArray={architectureCollate.Connections} />
            </div>
          </div>
          <div className={[styles['Integrations']].join(' ')}>
            <div className={[styles['ActionsHeadRight'], styles['diagram-top-level-heading']].join(' ')}></div>
            <div className={[
                styles['IntegrationsHead'],
                styles['diagram-column-heading']
              ].join(' ')}>
              Integrations
            </div>
            <div className={[styles['IntegrationsLogos']].join(' ')}>
              <DiagramLogos
                allowedHeight={520}
                logoArray={architectureCollate.Integrations} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ArchitectureDiagram.contextType = ServiceContext;

export async function getStaticProps(context) {
  return {
    props: {
    },
  };
};

export default ArchitectureDiagram;
