import React, { useContext, createContext, useState} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";

import './MainPanel.style.css' // CSS 추가
import SwitchONOFF from '@enact/sandstone/Switch';
import Dropdown from '@enact/sandstone/Dropdown';
import Button from "@enact/sandstone/Button";

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'; // 음성인식
// import userDB from "./userDB"; // userDB



export default function AuthExample() {
  return (
    <ProvideAuth>
      <Router>
        <div>
          <AuthButton />
				      <Link to="/introduction" style={{textDecoration: 'none', color : "white"}}>Introduction page</Link>
              <Link to="/public" style={{textDecoration: 'none', color : "white", marginLeft : "50px"}}>Public Page</Link>
              <Link to="/protected" style={{textDecoration: 'none', color : "white", marginLeft : "50px"}}>Protected Page</Link>
              <hr></hr>
          


          <Switch>
            <Route path="/public">
              <PublicPage />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
            <PrivateRoute path="/protected">
              <ProtectedPage />
            </PrivateRoute>
            <Route path="/join">
              <Join />
              </Route>
			<Route path="/introduction">
			<IntroductionPage />
			</Route>
          </Switch>
        </div>
      </Router>
    </ProvideAuth>
  );
}

const fakeAuth = {
  isAuthenticated: false,
  signin(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

/** For more details on
 * `authContext`, `ProvideAuth`, `useAuth` and `useProvideAuth`
 * refer to: https://usehooks.com/useAuth/
 */
const authContext = createContext();

function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

function useAuth() {
  return useContext(authContext);
}

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signin = cb => {
    return fakeAuth.signin(() => {
      setUser("정성길");
      cb();
    });
  };

  const signout = cb => {
    return fakeAuth.signout(() => {
      setUser(null);
      cb();
    });
  };

  return {
    user,
    signin,
    signout
  };
}

function AuthButton(props) {
  let history = useHistory();
  let auth = useAuth();

  return auth.user ? (
    <p>
      환영합니다! {auth.user} 님
      <button onClick={() => {auth.signout(() => history.push("/"));}} style={{marginLeft : "30px", borderRadius : "8px"}}><h2>Sign out</h2></button>
    </p>
  ) : (
    <p>Protected Page에서 로그인을 해주세요</p>
  );
}

// 인증되지 않은 화면을 표시 / 로그인으로 이동 page
function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

function PublicPage() {

return (
    <h1>public</h1>
);

  
}

function IntroductionPage(){
	return(
		<div>
			<div style={{
				float : "left"
			}}>
				<h2>족욕</h2>
				<p>
				▶혈액순환의 촉진<br></br>
				▶스트레스의 해소<br></br>
				▶질병의 예방 (ex 두통, 감기의 예방)<br></br>
				▶가벼운 운동을 한 것과 같은 효과<br></br>
				</p>
			</div>

			<div style={{
				marginLeft : "30px",
				float : "left"
			}}>
			<h2>반신욕</h2>
				<p>
				▶혈액순환<br></br>
				▶긴장과 스트레스의 해소<br></br>
				▶피로회복<br></br>
				</p>
			</div>

			<div style={{
				marginLeft : "30px",
				float : "left"
			}}>
			<h2>전신욕</h2>
				<p>
				▶혈액순환<br></br>
				▶긴장과 스트레스의 해소<br></br>
				▶피로회복<br></br>
				</p>
			</div>

		</div>

    

    
			
		);

}


function ProtectedPage() {
  const {transcript, resetTranscript} = useSpeechRecognition()
  
  if(!SpeechRecognition.browserSupportsSpeechRecognition()){
    return null
  }
  return(
<div className="main-container">
			<div className="temp-box box-three"> 
					<div>
						<Dropdown
							className = "down"
							defaultSelected={0}
							inline
							title="목욕 종류를 선택하세요">
							{['종류', '족욕(30%)', '반신욕(50%)', '전신욕(80%)']}
						</Dropdown>
					</div>

          <div className="temp-box box-four">
					<div>
						<HotOnOff></HotOnOff>
					</div>
					<div>
						<ColdOnOff></ColdOnOff>
					</div>
				</div>
				</div>
        <div>
        <h3>음성인식</h3>
    <Button onClick={resetTranscript, SpeechRecognition.startListening}>시작</Button>
    <Button onClick={SpeechRecognition.stopListening}>완료</Button>
    <Button onClick={resetTranscript}>Reset</Button>
    <p>{transcript}</p>
    </div>
			</div>
      
  );
  
}

function LoginPage() {
  let history = useHistory();
  let location = useLocation();
  let auth = useAuth();

  let { from } = location.state || { from: { pathname: "/" } };
  let login = () => {
    auth.signin(() => {
      history.replace(from);
    });
  };

  return (
    <div>
      <p>You must log in to view the page at {from.pathname}</p>
      <button onClick={login}>Log in</button><Link to = "/join"><button>join</button></Link>
    </div>
  );

}
// 회원가입 구현 (DB8 사용)
function Join(){

  return(
    <div>
      <h1>joinForm</h1>

    </div>
  );
}

// 물 ON/OFF
function HotOnOff() {
	let [isSelected, isSelectedChange] = useState(false);
	return (
	   <>
	   <div>
		  <span>
			 <SwitchONOFF onToggle={ (e)=>{isSelectedChange(e.selected); console.log(isSelected)}}/></span>
		  <span>
		  {  isSelected === true
			 ? <span>온수 ON</span>
			 : <span>온수 OFF</span>
		  }
		  </span>
	   </div>
	   </>
	);
 }

 function ColdOnOff() {
	let [isSelected, isSelectedChange] = useState(false);
	return (
	   <>
	   <div>
		  <span>
			 <SwitchONOFF onToggle={ (e)=>{isSelectedChange(e.selected); console.log(isSelected)}}/></span>
		  <span>
		  {  isSelected === true
			 ? <span>냉수ON</span>
			 : <span>냉수OFF</span>
		  }
		  </span>
	   </div>
	   </>
	);
 }

