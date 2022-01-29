import { useState } from "react";
import Stopwatch from "./Components/Stopwatch/stopwatch";

import { interval } from "rxjs";
import { map } from "rxjs/operators";
import "./App.css";

const delay = 1000;

function App() {
  const [timer, setTimer] = useState(0);
  const [diff, setDiff] = useState(0);

  const [subscription, setSubscription] = useState("");
  const [prevent, setPrevent] = useState(true);

  const onStartHandler = () => {
    if (!subscription) {
      const timerSubscription = interval(delay)
        .pipe(map((v) => v + 1))
        .subscribe((v) => {
          setTimer(v + diff);
        });
      setSubscription(timerSubscription);
    } else {
      subscription.unsubscribe();
      setTimer(0);
      setDiff(0);
      setSubscription("");
    }
  };

  const onWaitHandler = (event) => {
    if (prevent) {
      setPrevent(false);
      const timerInstance = () => {
        setPrevent(true);
        clearTimeout(timerInstance);
      };
    } else {
      if (subscription) {
        subscription.unsubscribe();
      }

      setDiff(timer);
      setSubscription("");
    }
  };

  const onResetHandler = () => {
    if (subscription) {
      subscription.unsubscribe();
    }

    const timerSubscription = interval(delay).subscribe((v) => {
      setTimer(v);
    });
    setSubscription(timerSubscription);
  };

  return (
    <div className="App">
      <h1>RxJS Stopwatch</h1>
      <hr />
      <Stopwatch timePassed={timer ? timer : diff} />
      <div>
        <button onClick={onStartHandler} className="btn btn-success">
          Start/Stop
        </button>
        <button onDoubleClick={onWaitHandler} className="btn btn-warning">
          Wait
        </button>
        <button onClick={onResetHandler} className="btn btn-danger">
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;