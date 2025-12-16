'use client';

const EventMap = () => {
  return (
    <div
      style={{
        marginTop: '80px',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid #222',
        boxShadow: '0 0 40px rgba(0,0,0,0.6)',
      }}
    >
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3572.472936383817!2d80.30471397546592!3d26.44048017693174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c47be08092f27%3A0xc0781e8266d6e4c5!2sPAC%20Grounds%20Railway%20Ground%20mela!5e0!3m2!1sen!2sin!4v1765810694677!5m2!1sen!2sin"
        width="100%"
        height="420"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ border: 0, filter: 'grayscale(100%) invert(92%)' }}
      />
    </div>
  );
};

export default EventMap;
