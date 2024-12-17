
import React from 'react';
import { Button } from '@/components/ui/button';
import Chatbox from '@/components/chatbox';
import GameTable from '@/components/gameTable';

export default function Game() {

    return (
        <div className="flex px-40">
            <div className="w-1/4 p-4 h-[80vh]">
                <div>
                    <Chatbox />
                </div>
            </div>

            <div className="w-2/4 p-4">
                <div className="bg-white shadow-lg rounded-lg pr-4 pl-4 h-[80vh]">
                    <GameTable />
                </div>
            </div>

            <div className="w-1/4 p-4 flex items-center justify-center">
                <Button
                    onClick={createGame}
                    className="w-full h-10 flex items-center justify-center"
                >
                    Create A Game
                </Button>
            </div>
        </div>
    );

}