interface Props {
  onClick: () => void;
}

function CreateEndpointBtn({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg bg-primary px-4 py-2 text-white"
    >
      + Create Endpoint
    </button>
  );
}

export default CreateEndpointBtn;
