module Oryx {
    export module Binding {
        export class Action {

            public $element      : Rosetta.INode;
            public event_type    : string;
            public target        : IActionTarget;
            public target_action : string;
            public element_event : ( e ) => void;

            constructor ( opts : {
                element        : Rosetta.INode;
                event_type     : string;
                target?        : Object;
                target_action? : string;
            } ) {
                this.$element      = opts.element;
                this.event_type    = opts.event_type;
                this.target        = <IActionTarget> opts.target;
                this.target_action = opts.target_action;
                this.element_event = ( e ) => { this.call_target_action( e ) };

                this.setup();
            }

            setup (): void {
                if ( this.target == undefined ) return;
                this.register_element_event();
            }

            set_target ( target : IActionTarget ): void {
                this.clear_target();
                this.target = target;
                this.setup();
            }

            set_target_data ( target_data : { target : IOutletTarget; action? : string; } ): void {
                this.clear_target();
                this.target = target_data.target;
                if ( target_data.action != undefined ) {
                    this.target_action = target_data.action;
                }
                this.setup();
            }

            clear_target (): void {
                this.unregister_element_event();
                this.target = undefined;
            }

            register_element_event (): void {
                this.$element.bind( this.event_type, this.element_event );
            }

            unregister_element_event (): void {
                this.$element.unbind( this.event_type, this.element_event );
            }

            call_target_action ( e ): void {
                // XXX - maybe this should throw an error??
                if ( this.target                     == undefined ) return;
                if ( this.target[this.target_action] == undefined ) return;
                this.target[this.target_action].apply( this.target, [ e ] );
            }

        }
    }
}