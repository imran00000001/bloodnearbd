

const SecTitle = ({ title, subHeading }) => {
    return (
        <div className="text-center my-10">
            <h2 className="font-display text-4xl font-semibold inline-block relative pb-4 text-wine">
                {title}
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-16 bg-amber rounded-full"></span>
            </h2>

            <p className="text-sm py-4 text-gray-500 tracking-wide uppercase">{subHeading}</p>
        </div>
    );
};

export default SecTitle;
