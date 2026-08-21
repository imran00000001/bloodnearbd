import SecTitle from "../../../Components/SectionTitle/SecTitle";

const WorldDonor = () => {
    return (
        <div>
            <SecTitle title={"Donor Day 2026"} subHeading={'Honoring Heroes: Donor Day Appreciation'} />
            <div className="bg-fixed bg-cover h-[500] items-center "
                style={{ backgroundImage: 'url(https://images.pexels.com/photos/12820063/pexels-photo-12820063.jpeg?auto=compress&cs=tinysrgb&w=1200)' }}>
                <div className=" bg-gradient-to-r from-red-100 bg-opacity-60">
                    <div className="w-3/4 mx-auto  md:pl-56 py-20" >
                        <h2 className="md:text-9xl text-6xl font-semibold text-[#7A1128]">WORLD</h2>


                        <div className="flex">
                            <h2 className="md:text-6xl text-3xl font-semibold text-[#7A1128]">Blood Donor Day</h2>

                            <span className="md:text-4xl text-2xl text-blue-900">   | 14 June</span>
                        </div>
                    </div>

                </div>


            </div>
        </div>
    );
};

export default WorldDonor;