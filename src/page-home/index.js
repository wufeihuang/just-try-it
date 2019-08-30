import React from 'react'

const App = () => {
  const [temp, setTemp] = React.useState(5);

  const log = () => {
    console.log('log')
    setTimeout(() => {
      console.log("3 秒前 temp = 5，现在 temp =", temp);
    }, 3000);
  };

  console.log('before return')

  return (
    <div
      onClick={() => {
        log();
        setTemp(3);
        // 3 秒前 temp = 5，现在 temp = 5
      }}
    >
      xyz  {temp}
    </div>
  );
};

export default function() {
  return (
    <div className="home--content">
      content
      <App />
    </div>
  )
}