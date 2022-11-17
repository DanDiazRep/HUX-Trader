import PersonCard from "./PersonCard";

// This is the home screen for non logged in users
export const About = () =>{
  return (
    <div className="relative flex-row items-center bg-cover bg-gradient-to-r from-white to-slate-100">
      <div className="text-center p-8 pt-32">
         <p className="text-black text-6xl align-middle">About us</p>
      </div>
      <div className="relative flex flex-wrap items-center justify-between px-60 py-10 pb-32">
        <PersonCard image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu3_qIHtXBZ7vZeMQhyD8qLC1VRB9ImHadL09KET_iSQEX6ags4ICknfmqEKz8Nf6IOsA&usqp=CAU" name="Brenden" text="Hello"/>
        <PersonCard image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu3_qIHtXBZ7vZeMQhyD8qLC1VRB9ImHadL09KET_iSQEX6ags4ICknfmqEKz8Nf6IOsA&usqp=CAU" name="Daniel" text="Hello"/>
        <PersonCard image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu3_qIHtXBZ7vZeMQhyD8qLC1VRB9ImHadL09KET_iSQEX6ags4ICknfmqEKz8Nf6IOsA&usqp=CAU" name="Tim" text="Hello"/>
      </div>
    </div>
  );
}