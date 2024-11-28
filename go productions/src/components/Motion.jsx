import '../styles/Motion.css';
import SliderComponent from './Sliders/SliderComponent';

const Motion = () => {
  // useEffect(() => {
  //   onLoad();
  // }, [onLoad]);
  return (
    <div className='motion-section'>
      <div className='motion-header'>
        <h2 className='font-chesna'>MOTION</h2>
        <p>YOUR VISION, OUR EXPERTISE</p>
        <a href='motions' className='see-more'>
          SEE MORE
        </a>
      </div>
      <SliderComponent />
    </div>
  );
};

export default Motion;
