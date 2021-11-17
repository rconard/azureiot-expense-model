import { Component, Fragment } from 'react';
import Image from 'next/image';
import _ from 'lodash';
import { ServiceContext } from '../contexts/ServiceContext.js';
import sharedStyles from '../styles/services/shared.module.css';

const staticImageLoader = (imageFileName) => {
  return `/logos/${imageFileName.src}`;
}

class DiagramLogos extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {
    } = this.context;
    const {
      allowedHeight,
      logoArray,
    } = this.props;
    
    return (
      <Fragment>
        {logoArray.map((logo) => {
          return (
            <div
              key={logo}
              style={{
                margin: '0 auto 4px',
                position: 'relative',
                height: 110,
                maxHeight: allowedHeight / Math.max(logoArray.length, 1),
                width: 110,
              }} >
              <Image
                loader={staticImageLoader}
                src={logo}
                layout='fill'
                objectFit='contain' />
            </div>
          );
        })}
      </Fragment>
    );
  }
}

DiagramLogos.contextType = ServiceContext;

export async function getStaticProps(context) {
  return {
    props: {
    },
  };
};

export default DiagramLogos;
